Component({
    externalClasses: ['wux-class'],
    relations: {
        '../accordion/index': {
            type: 'child',
            linked() {
                this.changeCurrent()
            },
            linkChanged() {
                this.changeCurrent()
            },
            unlinked() {
                this.changeCurrent()
            },
        },
    },
    properties: {
        defaultCurrent: {
            type: Array,
            value: [],
        },
        current: {
            type: Array,
            value: [],
            observer: 'changeCurrent',
        },
        auto: {
            type: Boolean,
            value: true,
        },
        accordion: {
            type: Boolean,
            value: false,
        },
        title: {
            type: String,
            value: '',
        },
        label: {
            type: String,
            value: '',
        },
    },
    data: {
        activeKey: '',
        keys: [],
    },
    methods: {
        updated(activeKey, condition) {
            const elements = this.getRelationNodes('../accordion/index')

            if (elements.length > 0) {
                if (condition) {
                    this.setData({
                        activeKey,
                    })

                    elements.forEach((element, index) => {
                        const key = element.data.key || String(index)
                        const current = this.data.accordion ? activeKey[0] === key : activeKey.indexOf(key) !== -1

                        element.changeCurrent(current, key)
                    })
                }
            }

            if (this.data.keys.length !== elements.length) {
                this.setData({
                    keys: elements.map((element) => element.data)
                })
            }
        },
        changeCurrent(activeKey = this.data.current) {
            this.updated(activeKey, !this.data.auto)
        },
        emitEvent(key) {
            this.triggerEvent('change', {
                key,
                keys: this.data.keys,
            })
        },
        setActiveKey(activeKey) {
            if (this.data.activeKey !== activeKey) {
                this.updated(activeKey, this.data.auto)
            }

            this.emitEvent(this.data.accordion ? activeKey[0] : activeKey)
        },
        onClickItem(key) {
            let activeKey = [...this.data.activeKey]

            if (this.data.accordion) {
                activeKey = activeKey[0] === key ? [] : [key]
            } else {
                activeKey = activeKey.indexOf(key) !== -1 ? activeKey.filter((n) => n !== key) : [...activeKey, key]
            }

            this.setActiveKey(activeKey)
        },
    },
    ready() {
        const { defaultCurrent, current, auto } = this.data
        const activeKey = !auto ? current : defaultCurrent

        this.updated(activeKey, true)
    },
})