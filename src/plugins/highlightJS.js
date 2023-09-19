import { ref, h, computed, defineComponent, watch } from 'vue';
import hljs from 'highlight.js/lib/core';

{/* <g-highlightJS language="js" code="console.log('Hello World')"></g-highlightJS>; */}

const escapeHtml = (value) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const highlightJS = defineComponent({
  props: {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: '',
    },
    autodetect: {
      type: Boolean,
      default: true,
    },
    ignoreIllegals: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const language = ref(props.language);
    watch(
      () => props.language,
      (newLanguage) => {
        language.value = newLanguage;
      },
    );

    const autodetect = computed(() => props.autodetect && !language.value);
    const cannotDetectLanguage = computed(
      () => !autodetect.value && !hljs.getLanguage(language.value),
    );

    const className = computed(() => {
      if (cannotDetectLanguage.value) {
        return '';
      } else {
        return `hljs ${language.value}`;
      }
    });

    const highlightedCode = computed(() => {
      // No idea what language to use, return raw code
      if (cannotDetectLanguage.value) {
        console.warn(`The language "${language.value}" you specified could not be found.`);
        return escapeHtml(props.code);
      }

      if (autodetect.value) {
        const result = hljs.highlightAuto(props.code);
        language.value = result.language ?? '';
        return result.value;
      } else {
        const result = hljs.highlight(props.code, {
          language: language.value,
          ignoreIllegals: props.ignoreIllegals,
        });
        return result.value;
      }
    });

    return {
      className,
      highlightedCode,
    };
  },
  render() {
    return h('pre', {}, [
      h('code', {
        class: this.className,
        innerHTML: this.highlightedCode,
        tabindex: '0',
      }),
    ]);
  },
});

const plugin = {
  install(app) {
    app.component('g-highlightJS', highlightJS);
  },
};
export default plugin;
