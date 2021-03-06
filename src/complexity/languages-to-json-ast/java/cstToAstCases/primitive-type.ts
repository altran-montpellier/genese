import { cstToAst } from '../cst-to-ast';
import { PrimitiveType } from '../models/primitive-type.model';
import { PrimitiveTypeChildren } from '../models/primitive-type-children.model';

// @ts-ignore
export function run(cstNode: PrimitiveType, children: PrimitiveTypeChildren): any {
    const numericType = children.numericType;

    return [
        ...[].concat(...numericType?.map(e => cstToAst(e)) ?? [])
    ];
}
