export interface Toaster {
  title: string;
  message: string;
  timeOut: number;
  position:
    | 'toast-top-left'
    | 'toast-top-center'
    | 'toast-top-right'
    | 'toast-bottom-left'
    | 'toast-bottom-center'
    | 'toast-bottom-right'; // there is extra two full width (top, bottom) classes to add (optinal)
}
