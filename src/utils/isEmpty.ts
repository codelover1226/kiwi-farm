export default (value: any) => (
    value === null || value === undefined || (typeof value == 'string' && value.trim().length === 0) || (typeof value == 'object' &&  Object.entries(value).length == 0) || ( typeof value == 'number' && value == 0)
)