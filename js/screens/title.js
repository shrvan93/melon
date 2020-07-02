game.TitleScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // setam o imagine de background
        let back = new me.Sprite(
            0, 0, { image: me.loader.getImage('title_screen') }
        )
        console.log(me.game.viewport.width)

        back.anchorPoint.set(0, 0)
        back.scale(me.game.viewport.width / back.width, me.game.viewport.height / back.height)
        
        me.game.world.addChild(back, 1)

        // scrolling text
        let text = new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height])
            
                this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'))

                this.scrolltween = new me.Tween(this)
                                        .to({scrollerpos: -800 }, 1000)
                                        .onComplete(this.scrollover.bind(this))
                                        .start()

                this.scroller = "WELCOME TO MY FIRST MELONJS GAME! PLEASE SEND ME FEEDBACK"
                this.scroollerpos = 640
            },
            scrollover: function() {
                this.scrollerpos = 640
                this.scrolltween = new me.Tween(this)
                                        .to({scrollerpos: -800 }, 1000)
                                        .onComplete(this.scrollover.bind(this))
                                        .start()
            },
            update: function() {
                return true
            },
            draw: function(renderer) {
                this.font.draw(renderer, "PRESS ENTER TO PLAY", 20, 240)
                this.font.draw(renderer, this.scroller, this.scrollerpos, 400)
            },
            onDestroyEvent: function() {
                this.scrollertween.stop()
            }
        }))

        me.game.world.addChild(text, 2)

        // schimbam ecranul cand se apasa enter sau se da click
        me.input.bindKey(me.input.KEY.ENTER, "start", true)
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER)
        this.startHandler = me.event.subscribe(me.event.KEYDOWN, (action) => {
            if (action === "start") {
                // efect sonor
                me.audio.play("cling")
                // pornim jocul
                me.state.change(me.state.PLAY)
            }
        })
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER)
        me.input.unbindPointer(me.input.pointer.LEFT)
        me.event.unsubscribe(this.startHandler)
    }
});
