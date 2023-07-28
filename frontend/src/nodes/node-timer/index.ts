import { createHooksFromVue } from "@/nodes/index";
import type { LabNodeContext, LabNodeHooks, LabNode } from "@/nodes";
import LabNodeTimer from "./node-view.vue";
import ElementPlus from "element-plus";
import { ref } from "vue";

export const createNodeTimerHooks = (context: LabNodeContext): LabNodeHooks => {
  const timeout = ref(1000);
  const timer = ref(0);
  const { onMount, onUnmount, getApp } = createHooksFromVue(LabNodeTimer);
  getApp().use(ElementPlus);

  const startTimer = () => {
    if (timer.value) {
      window.clearInterval(timer.value);
    }

    timer.value = window.setInterval(() => {
      console.log("timer");
      context.invokeAction("on_timer");
    }, timeout.value);
  };

  const stopTimer = () => {
    if (timer.value) {
      window.clearInterval(timer.value);
    }
  };

  return {
    onCreated: () => {
      getApp().provide("readInput", (name: string) => {
        return context.readInput(name);
      });

      getApp().provide("invokeAction", (name: string) => {
        context.invokeAction(name);
      });

      getApp().provide("updateTimeout", (time: number) => {
        timeout.value = time;

        // if timer is running, restart it
        if (timer.value) {
          stopTimer();
          startTimer();
        }
      });

      getApp().provide("timeout", timeout);
    },
    onStart: () => {
      //
      startTimer();
    },
    onStop: () => {
      //
      stopTimer();
    },
    onDestroy: () => {
      //
      if (timer.value) {
        window.clearInterval(timer.value);
      }
    },
    onMount,
    onUnmount,
  };
};

export default <LabNode>{
  name: "node-timer",
  label: "定时器",
  description: "定时器节点,每隔一段时间触发一次",
  vendor: "Evan Xiao",
  inputs: [],
  outputs: [
    {
      name: "on_timer",
      label: "触发",
      type: "action",
    },
  ],
  hooks: (context) => createNodeTimerHooks(context),
};
