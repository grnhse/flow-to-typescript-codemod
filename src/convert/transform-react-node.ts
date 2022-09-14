import traverse from "@babel/traverse";
import { TransformerInput } from "./transformer";
import * as t from "@babel/types";
import { replaceWith } from "./utils/common";

/**
 * So far, we have transformed all the imports for React related types.
 *
 * This codemod transforms the React.Node flowtype to React.ReactNode typescript type
 * on identifiers when the type is directly imported from React
 *
 * Given starting import of:
 *     import React, { type Node } from 'react';
 *
 * Before:
 *     export default function MyComponent(props): Node ...
 *
 * After:
 *     export default function MyComponent(props): ReactNode ...
 */
export function transformReactNode({
  file,
  state,
  reporter,
}: TransformerInput) {
  traverse(file, {
    Identifier(path) {
      if (
        path.node.name === "Node" &&
        path.parentPath?.parentPath &&
        path.parentPath?.parentPath.type === "TSTypeAnnotation"
      ) {
        replaceWith(
          path,
          t.identifier("ReactNode"),
          state.config.filePath,
          reporter
        );
      }
    },
  });
}
