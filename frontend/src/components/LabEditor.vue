<template>
    <div class="lab-editor-container full-height">
        <EditorBackground class="editor-bg"></EditorBackground>
        <div class="editor-container" ref="editorContainer" :class="{ 'editor-zoom-animation': zooming }">
        </div>
        <!-- Toolbar -->
        <div class="lab-editor-toolbar">
            <el-button-group>
                <el-tooltip content="自动调整缩放" placement="top" :enterable="false" :auto-close="1000">
                    <el-button plain :icon="FullScreen" @click="autoZoom" />
                </el-tooltip>
                <el-tooltip content="停止运行" placement="top" :enterable="false" :auto-close="1000">
                    <el-button plain :icon="VideoPause" :disabled="!running" @click="stop" />
                </el-tooltip>
                <el-tooltip content="开始运行" placement="top" :enterable="false" :auto-close="1000">
                    <el-button plain :icon="VideoPlay" :disabled="running" @click="start" />
                </el-tooltip>
            </el-button-group>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { LabEditor, createEditor } from '@/components/LabEditor/editor';

import EditorBackground from '@/components/LabEditor/EditorBackground.vue'

import {
    FullScreen,
    VideoPause,
    VideoPlay

} from '@element-plus/icons-vue'

const editorContainer = ref<HTMLElement | null>(null)
let editorInstance : LabEditor | null = null

const zooming = ref(false)

const running = ref(false)


onMounted(async () => {
    const container = editorContainer.value as HTMLElement;
    editorInstance = await createEditor(container);

    watch(editorInstance.running, (val) => {
        running.value = val
    })
})

onBeforeUnmount(() => {
    editorInstance?.destory()
})

const autoZoom = () => {
    zooming.value = true
    editorInstance?.autoZoom()
    setTimeout(() => {
        zooming.value = false
    }, 200)
}

const stop = () => {
    editorInstance?.stop()
}

const start = () => {
    editorInstance?.start()
}


</script>
<style lang="scss">
.lab-editor-container {
    background-color: #1f1f1f;

    .editor-container {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .editor-zoom-animation > div {
        transition: transform 0.2s ease-in-out;
    }

    .lab-editor-toolbar {
        display: flex;

        // float center
        position: absolute;
        top: 32px;
        left: 50%;
        transform: translateX(-50%);

        border-radius: 4px;
        background-color: #1f1f1f;

    }
}


.editor-bg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    opacity: 0.1;
}
</style>