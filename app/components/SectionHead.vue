<script setup lang="ts">
defineProps<{
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
}>();
</script>

<template>
  <div class="mb-12 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-b-2 border-border pb-[18px]">
    <div>
      <p class="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
        {{ eyebrow }}
      </p>
      <h2
        v-if="heading"
        :id="headingId"
        class="mt-2.5 text-[clamp(1.875rem,3.8vw,2.75rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-heading"
      >
        {{ heading }}
      </h2>
    </div>
    <p class="text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
      {{ sheet }}
    </p>
  </div>
</template>
