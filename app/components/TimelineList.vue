<script setup lang="ts">
interface TimelineItem {
  /** Display text, e.g. "Aug 2021 → Jan 2025". */
  date: string;
  /** Role, degree or certificate. */
  role: string;
  /** Employer or issuer, with its location. */
  org: string;
  /** Description; only the `detailed` variant shows it. */
  desc?: string;
}

const props = withDefaults(defineProps<{
  /** Entries, newest first. */
  items: TimelineItem[];
  /**
   * `detailed` has gold square markers, a gold organisation and the
   * description (Experience); `compact` is the plain list (Education).
   */
  variant?: 'detailed' | 'compact';
}>(), {
  variant: 'detailed'
});

const detailed = computed(() => props.variant === 'detailed');

// Date column, then the ruled column; a single column on phones.
const rowClass = computed(() => [
  'grid gap-2.5 border-b border-border-subtle',
  'md:grid-cols-[minmax(120px,180px)_minmax(0,1fr)] md:gap-x-10 md:gap-y-2',
  detailed.value ? 'py-[26px]' : 'py-[18px]'
]);

const roleClass = computed(() => detailed.value
  ? 'text-xl font-bold'
  : 'text-[17px] font-bold');

const orgClass = computed(() => detailed.value
  ? 'mt-1 font-semibold text-accent-bright'
  : 'mt-0.5 text-text-muted');
</script>

<template>
  <ol>
    <li
      v-for="item in items"
      :key="`${item.date} ${item.role}`"
      :class="rowClass"
    >
      <p
        class="text-[13px] font-semibold text-accent"
        :class="detailed ? 'pt-[5px]' : 'pt-[3px]'"
      >
        {{ item.date }}
      </p>
      <div class="relative border-l-2 border-border pl-5 md:pl-7">
        <span
          v-if="detailed"
          aria-hidden="true"
          class="absolute top-2 -left-[7px] size-3 bg-accent"
        />
        <p
          class="text-heading"
          :class="roleClass"
        >
          {{ item.role }}
        </p>
        <p
          class="text-sm"
          :class="orgClass"
        >
          {{ item.org }}
        </p>
        <p
          v-if="detailed && item.desc"
          class="mt-2.5 max-w-[640px] text-[15px] leading-[1.6] text-text-muted"
        >
          {{ item.desc }}
        </p>
      </div>
    </li>
  </ol>
</template>
