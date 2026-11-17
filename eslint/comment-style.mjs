// Built-in rules can't check where a comment sits, so this one is ours.

const documentableTypes = new Set([
  'ClassDeclaration',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
  'FunctionDeclaration',
  'MethodDefinition',
  'PropertyDefinition',
  'TSAbstractMethodDefinition',
  'TSAbstractPropertyDefinition',
  'TSDeclareFunction',
  'TSEnumDeclaration',
  'TSEnumMember',
  'TSInterfaceDeclaration',
  'TSMethodSignature',
  'TSModuleDeclaration',
  'TSPropertySignature',
  'TSTypeAliasDeclaration'
]);

// Block comments that tools read, which can't be written with `//`.
const toolDirective = /^\s*(eslint|global|globals|exported|#__|@__|@vite-|webpackChunkName)/;

/** Whether a docblock on this node would document something. */
function isDocumentable(node) {
  if (documentableTypes.has(node.type)) {
    return true;
  }

  if (node.type === 'VariableDeclaration') {
    return node.parent.type === 'Program';
  }

  // Schema fields: their docblocks show on hover wherever the field is used.
  return node.type === 'Property' && node.parent.type === 'ObjectExpression';
}

/**
 * Whether a comment is a docblock directly above something it can document.
 * Several nodes can start at the same token, so this checks each of them.
 */
function isDocblock(comment, sourceCode) {
  if (!comment.value.startsWith('*')) {
    return false;
  }

  const next = sourceCode.getTokenAfter(comment);

  if (!next || next.loc.start.line > comment.loc.end.line + 1) {
    return false;
  }

  let node = sourceCode.getNodeByRangeIndex(next.range[0]);

  while (node && node.range[0] === next.range[0]) {
    if (isDocumentable(node)) {
      return true;
    }

    node = node.parent;
  }

  return false;
}

/** Rewrites a block comment as `//` lines, keeping its text and indentation. */
function toLineComments(comment) {
  const lines = comment.value
    .split('\n')
    .map(line => line.replace(/^\s*\*? ?/, '').trimEnd());

  while (lines.length > 1 && lines[0] === '') {
    lines.shift();
  }

  while (lines.length > 1 && lines.at(-1) === '') {
    lines.pop();
  }

  const indent = ' '.repeat(comment.loc.start.column);

  return lines
    .map(line => (line ? `// ${line}` : '//'))
    .join(`\n${indent}`);
}

/**
 * A fix is only safe if nothing shares the comment's lines: `//` would comment
 * out code after it, and an indented multi-line comment needs its own line.
 */
function canFix(comment, sourceCode) {
  const before = sourceCode.getTokenBefore(comment);
  const after = sourceCode.getTokenAfter(comment);
  const isMultiLine = comment.loc.start.line !== comment.loc.end.line;

  if (after && after.loc.start.line === comment.loc.end.line) {
    return false;
  }

  return !(isMultiLine && before?.loc.end.line === comment.loc.start.line);
}

/**
 * Requires `//` for every comment except docblocks on declarations, class and
 * interface members and object properties.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const commentStyle = {
  meta: {
    type: 'layout',
    fixable: 'code',
    schema: [],
    messages: {
      useLineComment: 'Use // here. /** */ is only for docblocks directly above a declaration, member or property.'
    }
  },
  create(context) {
    const { sourceCode } = context;

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (
            comment.type !== 'Block'
            || toolDirective.test(comment.value)
            || isDocblock(comment, sourceCode)
          ) {
            continue;
          }

          context.report({
            loc: comment.loc,
            messageId: 'useLineComment',
            fix: canFix(comment, sourceCode)
              ? fixer => fixer.replaceText(comment, toLineComments(comment))
              : null
          });
        }
      }
    };
  }
};
