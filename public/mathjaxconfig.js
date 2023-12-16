// mathjaxConfig.js
import MathJax from 'mathjax';

const MathJaxConfig = () => {
  MathJax.Hub.Config({
    tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  });
};

export default MathJaxConfig;
