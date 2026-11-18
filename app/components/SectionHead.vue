<script setup lang="ts">
withDefaults(defineProps<{
  /** Gold label above the heading, e.g. "01 — About". */
  eyebrow: string;
  /** Drawing-sheet label on the right, e.g. "Sheet A-01". */
  sheet: string;
  /**
   * Section heading. Leave it out when the section sets its own, larger
   * heading below the rule (Community).
   */
  heading?: string;
  /** Id for the h2, so the section can point `aria-labelledby` at it. */
  headingId?: string;
  /** Space below the rule: 24px (Experience), 48px or 56px (Work). */
  spacing?: 'sm' | 'md' | 'lg';
  /** Heading element: h2 for homepage sections, h1 when it heads a page. */
  level?: 'h1' | 'h2';
}>(), {
  heading: undefined,
  headingId: undefined,
  spacing: 'md',
  level: 'h2'
});

const margins = {
  sm: 'mb-6',
  md: 'mb-12',
  lg: 'mb-14'
};
</script>

<template>
  <div
    class="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-b-2 border-border pb-[18px]"
    :class="margins[spacing]"
  >
    <div>
      <p class="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
        {{ eyebrow }}
      </p>
      <component
        :is="level"
        v-if="heading"
        :id="headingId"
        class="mt-2.5 text-[clamp(1.875rem,3.8vw,2.75rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-heading"
      >
        {{ heading }}
      </component>
    </div>
    <p class="text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
      {{ sheet }}
    </p>
  </div>
</template>
