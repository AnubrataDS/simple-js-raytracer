function main() {
  var t0 = performance.now();
  generate();
  var t1 = performance.now();
  render();
  var t2 = performance.now();

  console.log(`Generated in ${t1 - t0} ms`);
  console.log(`Rendered in ${t2 - t1} ms`);
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
