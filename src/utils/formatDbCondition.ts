//@ts-ignore
export const  _formatCondition = (args: any) => Object.entries(args).reduce((acc, [key, value]) =>
  Object.assign(acc, value ? {[key]: value} : null), {})