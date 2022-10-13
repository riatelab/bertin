export function str2fun(string) {
  const newfunc = new Function(`return (${string})`);
  return newfunc();
}
