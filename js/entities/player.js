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
        this.body.setMaxVelocity(3, 14)
        this.body.setFriction(0.4, 0)

        // setam display-ul sa urmareasca personajul nostru
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4)

        this.alwaysUpdate = true

        // definim animatia pentru mers
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7])

        // definim animatia pentru stat pe loc
        this.renderable.addAnimation("stand", [0])

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
            this.body.jumping = true
            if (this.multipleJump <= 2) {
                // easy "math" for double jump
                this.body.force.y = -this.body.maxVel.y * this.multipleJump++;
                
                me.audio.play("jump", false)
            }
        }
        else {

            this.body.force.y = 0;

            if (!this.body.falling && !this.body.jumping) {
                // reset the multipleJump flag if on the ground
                this.multipleJump = 1;
            }
            else if (this.body.falling && this.multipleJump < 2) {
                // reset the multipleJump flag if falling
                this.multipleJump = 2;
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0 ||
            (this.renderable && this.renderable.isFlickering())
        ) {
            this._super(me.Entity, "update", [dt]);
            return true;
        }

        return false;
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
 
        switch(response.b.body.collisionType) {

            case me.collision.types.ENEMY_OBJECT:
                // daca este inamic mobil
                if (other.isMovingEnemy) {
                    // saritura in capul inamicului
                    if (response.overlapV.y > 0 && this.body.falling) {
                        // sare
                        this.body.vel.y = -this.body.maxVel.y * 1.5 * me.timer.tick
                    } else {
                        this.hurt()
                    }
                    return false
                } else {
                    // inamic fix
                    // sare
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick
                    // este ranit
                    this.hurt()
                }

            default:
                return true
        }
    },


    hurt: function() {
        if (!this.renderable.isFlickering()) {
            this.renderable.flicker(1000)
            me.audio.play("stomp", false)
        }
    }
});


