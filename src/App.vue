<template>
    <div>
        姓名：<input type="text" v-model="name"> <br />
        年龄：<input type="number" v-model="age"> <br />
        <button v-on:click="add_age">添加</button> <br />
        <button v-on:click="changeName">修改姓名</button> <br />
        <button v-on:click="showUI">显示/隐藏个人信息</button> <br />
        <hr v-show="show_UI" />
        <div v-show="show_UI">
            <h3>
                姓名：{{ change_name }} <br />
                年龄：{{ age }} <br />
            </h3>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            name: '',
            age: 0,
            change_name: '',
            show_UI: false
        }
    },
    methods: {
        add_age() {
            this.age += 1;
        },
        changeName() {
            this.change_name = this.name;
        },
        showUI() {
            this.show_UI = !this.show_UI;
        }
    }
}
</script>

<style scoped>

</style>
