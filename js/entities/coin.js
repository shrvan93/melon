/**
 * Coin Entity
 */
game.Coin = me.CollectableEntity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.CollectableEntity, 'init', [x, y , settings])
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // dispare moneda
        this.body.setCollisionMask(me.collision.types.NO_OBJECT)

        // sunet
        me.audio.play("cling", false)

        // scoatem moneda din joc
        me.game.world.removeChild(this)

        // crestem scorul
        game.data.score += 100

        // obiectul nu este solid
        return false
    }
})