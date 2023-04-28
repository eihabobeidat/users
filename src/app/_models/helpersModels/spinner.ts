export interface Spinner {
  type:
    | 'ball-8bits'
    | 'ball-atom'
    | 'ball-beat'
    | 'line-scale-party'
    | 'ball-scale-multiple'; //for more http://github.danielcardoso.net/load-awesome/animations.html and add the type style to angular.json
  size: 'small' | 'default' | 'medium' | 'large';
  bdColor: string;
  color: string;
  template?: string;
}
