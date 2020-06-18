/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings])

        // setam viteza maxima si frictiunea
        this.body.setMaxVelocity(4, 15)
        this.body.setFriction(0.4, 0)

        // setam display-ul sa urmareasca personajul nostru
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4)

        this.alwaysUpdate = true

        // definim animatia pentru mers
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7])

        // definim animatia pentru stat pe loc
        this.renderable.addAnimation("stand", [0])

        // setam numarul sariturii (initial)
        this.multipleJump = 1

        // setam animatia default
        this.renderable.setCurrentAnimation("stand")
    },

    /**
     * update the entity
     */
    update : function (dt) {

        if (me.input.isKeyPressed("left")) {
            // schimbam orientarea
            this.renderable.flipX(true)
            // schimbam directia vitezei (velocitatea)
            this.body.force.x = -this.body.maxVel.x
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk")
            }
        } else if (me.input.isKeyPressed("right")) {
            // schimbam orientarea
            this.renderable.flipX(false)
            // schimbam directia vitezei (velocitatea)
            this.body.force.x = this.body.maxVel.x
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk")
            }
        } else {
            // setam viteaza 0 pe axa x
            this.body.force.x = 0
            this.renderable.setCurrentAnimation("stand")
        }

        if (me.input.isKeyPressed("jump")) {
            // setam corpul ca fiind in saritura
            this.body.jumping = true

            // setam forta proportional cu numarul sariturii
            if (this.multipleJump <= 2) {
                this.body.force.y = -this.body.maxVel.y * this.multipleJump++
            }
        } else {
            // setam viteaza 0 pe axa y
            this.body.force.y = 0
            // cand corpul nu se misca
            if (!this.body.jumping && !this.body.falling) {
                // resetam multiple jump
                this.multipleJump = 1
            }
            // daca este in cadere setam multiple jump pe 2 ca sa nu mai poata
            // sari din nou
            if (this.body.falling && this.multipleJume < 2) {
                this.multipleJump = 2
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // verificam daca corpul se misca si trebuie actualizat
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0 || 
            (this.renderable && this.renderable.isFlickering())) {
                this._super(me.Entity, "update", [dt])
                // se misca
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
        // Make all other objects solid
        return true;
    }
});

