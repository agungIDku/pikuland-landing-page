/**
 * Normalized row from `GET client/careers` → `data[]`.
 * API fields: `_id`, `title`, `description`, `due_date`, `email`, `location`, `department`, …
 * Optional later: `type` | `employment_type` | `job_type` — UI shows `"—"` when absent.
 */
export interface CareerJob {
  id: string;
  title: string;
  department: string;
  /** Employment / contract type (pill); `"—"` when API omits all known keys. */
  type: string;
  /** Raw body from API (HTML or plain). */
  description: string;
  qualifications?: string[];
  /** Human-readable deadline for footer line */
  dueDateLabel: string;
  email: string;
  location?: string;
}
