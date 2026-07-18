const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

export { classSet }
