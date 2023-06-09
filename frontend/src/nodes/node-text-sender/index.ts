import { createHooksFromVue, LabNode } from "@/nodes/index";
import type { LabNodeHooks, LabNodeContext } from "@/nodes";
import LadNodeView from "./node-view.vue";
import ElementPlus from "element-plus";

import { ref } from "vue";

export const createNodeHooks = (context: LabNodeContext): LabNodeHooks => {
  const { onMount, onUnmount, app } = createHooksFromVue(LadNodeView);

  app.use(ElementPlus);

  const inputText = ref<string>("");
  const running = ref<boolean>(false);
  const appendLine = ref<boolean>(true);

  const sendText = () => {
    if (!running.value) {
      return;
    }

    const textField = inputText.value;
    const exInput = context.readInput("text");

    let text = "";

    // 优先使用 textField 的内容
    if (textField) {
      text = textField;
    } else if (exInput.data && exInput.type === "string") {
      text = exInput.data as string;
    } else {
      return;
    }

    context.invokeAction("output", {
      data: appendLine.value ? text + "\n" : text,
      type: "string",
    });
  };

  const updateNodeConnection = () => {
    context.updateNode();
  };

  return {
    onCreate: () => {
      app.provide("readInput", (name: string) => {
        return context.readInput(name);
      });

      app.provide("invokeAction", (name: string) => {
        context.invokeAction(name);
      });

      app.provide("inputText", inputText);
      app.provide("sendText", sendText);
      app.provide("updateNodeConnection", updateNodeConnection);
      app.provide("running", running);
      app.provide("appendLine", appendLine);
    },
    onStart: () => {
      //
      running.value = true;
    },
    onStop: () => {
      //
      running.value = false;
    },
    onAction: (name: string) => {
      if (name === "send") {
        sendText();
      }
    },
    onMount,
    onUnmount,
  };
};

export default <LabNode>{
  name: "node-text-sender",
  label: "文字发送",
  description: "将输入的文字以操作形式发送出去",
  vendor: "Evan Xiao",
  inputs: [
    {
      name: "text",
      label: "内容",
      type: "data",
      dataType: ["string"],
    },
    {
      name: "send",
      label: "发送",
      type: "action",
      dataType: [],
    },
  ],
  outputs: [
    {
      name: "output",
      label: "数据",
      type: "action",
      dataType: "string",
    },
  ],
  hooks: (context) => createNodeHooks(context),
};
