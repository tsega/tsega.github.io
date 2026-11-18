<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Small uppercase label in the left column. */
  label: string;
  /** Left column width: 72px (Community), 96px (hero, About), 110px (Work). */
  labelWidth?: 'sm' | 'md' | 'lg';
  /**
   * `card` is the padded row inside a bordered box (hero info card);
   * `list` is the flush row used in running text (About, Work).
   */
  variant?: 'card' | 'list';
  /** Gold label instead of muted, as in the Work briefs. */
  accent?: boolean;
}>(), {
  labelWidth: 'md',
  variant: 'list',
  accent: false
});

// One label/value pair. Render it inside a <dl>; the parent owns the list.
const columns = {
  sm: 'grid-cols-[72px_minmax(0,1fr)]',
  md: 'grid-cols-[96px_minmax(0,1fr)]',
  lg: 'grid-cols-[110px_minmax(0,1fr)]'
};

const rowClass = computed(() => [
  columns[props.labelWidth],
  // Card rows sit in a bordered box, so the last one drops its rule.
  props.variant === 'card' ? 'items-baseline px-5 py-[18px] last:border-b-0' : 'py-3.5'
]);

const labelClass = computed(() => [
  props.accent ? 'text-accent' : 'text-text-muted',
  props.variant === 'card' ? 'text-[10px] tracking-[0.14em]' : 'pt-[3px] text-[11px] tracking-[0.12em]'
]);
</script>

<template>
  <div
    class="grid gap-4 border-b border-border-subtle"
    :class="rowClass"
  >
    <dt
      class="font-semibold uppercase"
      :class="labelClass"
    >
      {{ label }}
    </dt>
    <dd>
      <slot />
    </dd>
  </div>
</template>
