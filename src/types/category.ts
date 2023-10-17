export type CategoryId =
  | "vnptbg"
  | "bdvbg"
  | "tinhdoanbg"
  | "ubndbg"
  | "ldldbg"
;

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
}
