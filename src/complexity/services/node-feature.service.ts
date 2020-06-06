import * as ts from 'typescript';
import { NodeFeature } from '../enums/node-feature.enum';
import { CpxFactors } from '../models/cpx-factor/cpx-factors.model';
import { cpxFactors } from '../cpx-factors';
import { TreeNode } from '../models/tree/tree-node.model';
import { Ast } from './ast.service';

export class NodeFeatureService {


    getFeature(node: ts.Node): NodeFeature {
        if (!node) {
            return undefined;
        }
        switch (node.kind) {
            case ts.SyntaxKind.FalseKeyword:
            case ts.SyntaxKind.FirstLiteralToken:
            case ts.SyntaxKind.NumericLiteral:
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.TrueKeyword:
                return NodeFeature.BASIC;
            case ts.SyntaxKind.BinaryExpression:
                return NodeFeature.BINARY;
            case ts.SyntaxKind.CatchClause:
            case ts.SyntaxKind.IfStatement:
            case ts.SyntaxKind.SwitchStatement:
                return NodeFeature.CONDITIONAL;
            case ts.SyntaxKind.Block:
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.ElementAccessExpression:
            case ts.SyntaxKind.EndOfFileToken:
            case ts.SyntaxKind.ExpressionStatement:
            case ts.SyntaxKind.Parameter:
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.VariableDeclarationList:
            case ts.SyntaxKind.VariableStatement:
                return NodeFeature.EMPTY;
            case ts.SyntaxKind.ArrowFunction:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.MethodDeclaration:
                return NodeFeature.FUNC;
            case ts.SyntaxKind.AmpersandAmpersandToken:
            case ts.SyntaxKind.BarBarToken:
                return NodeFeature.LOGIC_DOOR;
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement:
            case ts.SyntaxKind.WhileStatement:
                return NodeFeature.LOOP;
            case ts.SyntaxKind.RegularExpressionLiteral:
                return NodeFeature.REGEX;
            case ts.SyntaxKind.ConditionalExpression:
                return NodeFeature.TERNARY;
            default:
                return NodeFeature.BASIC;
        }
    }


    /**
     * Increases the cognitive complexity when there is a binary succeeding to a binary of different type
     * For example, the second && is not increasing the cognitive complexity :
     *      if (a && b && c)
     * but in the next example, the || will increase it because it succeeds to a binary of different type (a &&)
     *      if (a && b || c)
     * Furthermore, when there are brackets separating the "and" and the "or", the cognitive complexity don't increase
     *      if ((a && b) || c)
     * @param tree      // The TreeNode to analyse
     */
    getBinaryCpxFactors(tree: TreeNode): CpxFactors {
        const cpxFact = new CpxFactors();
        if (!tree?.node || !tree.parent.node) {
            return cpxFact;
        }
        if (Ast.isBinary(tree.node) && Ast.isLogicDoor(tree.node)) {
            cpxFact.structural.logicDoor = cpxFactors.structural.logicDoor;
            if (Ast.isBinary(tree.parent?.node)
                && !Ast.isSameOperatorToken(tree.node, tree.parent.node)
                && !Ast.isOrTokenBetweenBinaries(tree.node)
            ) {
                cpxFact.aggregation.differentLogicDoor = cpxFactors.aggregation.differentLogicDoor;
            }
        }
        return cpxFact;
    }
}