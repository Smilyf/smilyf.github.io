function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/php" instead of "highlight.js/lib/languages/php.js"'
      );
    }
  }
  emitWarning();
    import lang from './php.js';
    export default lang;