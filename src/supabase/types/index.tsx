import { MergeDeep } from 'type-fest'
import { Database as Test } from './test'
import { Database as Test1 } from './test1'

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  Test,
  Test1
>