game.PlayScreen = me.Stage.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;

        // load map
        me.levelDirector.loadLevel("game01")

        // play audio track
        // me.audio.playTrack("dst-inertexponent")

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.audio.stopTrack()

        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
