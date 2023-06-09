import { createHooksFromVue,LabNode } from "@/nodes/index";
import type { LabNodeHooks, LabNodeContext } from "@/nodes";
import LabNodeCounter from "./node-view.vue";

import { ref } from "vue";

export const createNodeCounterHooks = (
  context: LabNodeContext
): LabNodeHooks => {
  const count = ref(0);

  const { onMount, onUnmount, app } = createHooksFromVue(LabNodeCounter);

  return {
    onCreate: () => {
      app.provide("readInput", (name: string) => {
        return context.readInput(name);
      });

      app.provide("invokeAction", (name: string) => {
        context.invokeAction(name);
      });

      app.provide("count", count);
    },
    onStop: () => {
      count.value = 0;
    },
    onAction: (name: string) => {
      if (name === "trigger") {
        count.value++;
      } else if (name === "reset") {
        count.value = 0;
      }
    },
    onDataOutput: (name: string) => {
      if (name === "count") {
        return {
          data: count.value,
          type: "number",
        };
      }
    },
    onMount,
    onUnmount,
  };
};

export default <LabNode>{
  name: "node-counter",
  label: "触发计数",
  description: "对触发输入进行计数",
  vendor: "Evan Xiao",
  inputs: [
    {
      name: "trigger",
      label: "计数",
      type: "action",
      dataType: [],
    },
    {
      name: "reset",
      label: "重置",
      type: "action",
      dataType: [],
    }
  ],
  outputs: [{
    name: "count",
    label: "计数",
    type: "data",
    dataType: "number",
  }],
  hooks: (node) =>  createNodeCounterHooks(node),
}
