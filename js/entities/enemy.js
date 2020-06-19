/**
 * Enemy Entity
 */
game.EnemyEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {

        // salvam lungimea initiala a elementului din harta
        // (locul unde se plimba)
        var width = settings.width || settings.framewidth

        // definim imaginea
        settings.image = "wheelie_right"

        // setam lungimea si inaltimea frame-ului
        settings.framewidth = settings.width = 64
        settings.frameheight = settings.height = 64

        settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight)

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings])

        x = this.pos.x
        // de unde porneste
        this.startX = x
        // unde se intoarce
        this.endX = x + width - settings.framewidth
        // pozitia intiala
        this.pos.x = this.endX

        // directia de mers
        this.walkLeft = false

        // setam viteza maxima si frictiunea
        this.body.setMaxVelocity(1, 0)
        //this.body.setFriction(0.4, 0)
        this.body.force.set(1, 0)

        // setam tipul de coliziune pentru a recunaste acest tip de obiect
        this.body.collisionType = me.collision.types.ENEMY_OBJECT

        // nu vrem sa actualizam personajul cat timp nu este vizibil
        this.alwaysUpdate = true

        // este un inamic in miscare
        this.isMovingEnemy = true
    },

    /**
     * update the entity
     */
    update : function (dt) {
        // a ajuns la start?
        if (this.walkLeft && this.pos.x <= this.startX) {
            // forta este pozitiva (merge la dreapta)
            this.body.force.x = Math.abs(this.body.force.x)
            // il intoarcem cu fata spre dreapta
            this.renderable.flipX(false)
            this.walkLeft = false
        } else if (!this.walkLeft && this.pos.x >= this.endX) {
            // a ajuns la final?
            // forta este negativa (merge la stanga)
            this.body.force.x = -Math.abs(this.body.force.x)
            // il intoarcem cu fata spre stanga
            this.renderable.flipX(true)
            this.walkLeft = true
        }
        this.body.update(dt)

        // verificam daca corpul se misca si trebuie actualizat
        if (this._super(me.Entity, "update", [dt]) || 
            this.body.vel.x !== 0 || this.body.vel.y !== 0) {
                return true;
            }
        
        // nu se misca
        return false;
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
            // omoram personajul
            this.alive = false
            // crestem scorul
            game.data.score += 50
            // sterge obiectul
            this.body.setCollisionMask(me.collision.types.NO_OBJECT)
            // flickering:
            var self = this
            this.renderable.flicker(1000, function () {
                me.game.world.removeChild(self)
            })
        }
        // Make all other objects solid
        return true;
    }
});

