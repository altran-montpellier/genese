import { cstToAst, getAlias } from '../cstToAst';

// @ts-ignore
export function run(cstNode, children) {
    return {
        kind: getAlias('ReturnStatement'),
        start: cstNode.location.startOffset,
        end: cstNode.location.endOffset,
        children: [
            ...[].concat(...children.expression?.map(e => cstToAst(e)) ?? [])
        ]
    };
}