export type CoverDoodle = {
  id: 'birthday-cake' | 'teacher-apple' | 'pencil' | 'sparkles';
  label: string;
};

export const coverDoodles: readonly CoverDoodle[] = [
  { id: 'birthday-cake', label: 'Birthday cake' },
  { id: 'teacher-apple', label: 'Teacher apple' },
  { id: 'pencil', label: 'Pencil' },
  { id: 'sparkles', label: 'Sparkles' }
];
