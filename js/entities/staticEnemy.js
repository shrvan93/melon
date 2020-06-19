/**
 * Enemy Entity
 */
game.StaticEnemy = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {

        // setam lungimea si inaltimea frame-ului
        settings.framewidth = settings.width
        settings.frameheight = settings.height

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings])

        // setam tipul de coliziune pentru a recunaste acest tip de obiect
        this.body.collisionType = me.collision.types.ENEMY_OBJECT

        // nu vrem sa actualizam personajul cat timp nu este vizibil
        this.alwaysUpdate = false

        // este un inamic in miscare
        this.isMovingEnemy = false
    },

    /**
     * update the entity
     */
    update : function (dt) {
        // nu se misca
        return false;
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

