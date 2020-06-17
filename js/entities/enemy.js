/**
 * an enemy Entity
 */
game.EnemyEntity = me.Entity.extend(
    {
        init: function (x, y, settings)
        {
            // save the area size defined in Tiled
            var width = settings.width || settings.framewidth;

            // define this here instead of tiled
            settings.image = "wheelie_right";

            // adjust the size setting information to match the sprite size
            // so that the entity object is created with the right size
            settings.framewidth = settings.width = 64;
            settings.frameheight = settings.height = 64;

            // redefine the default shape (used to define path) with a shape matching the renderable
            settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

            // call the super constructor
            this._super(me.Entity, "init", [x, y , settings]);

            // set start/end position based on the initial area size
            x = this.pos.x;
            this.startX = x;
            this.endX   = x + width - settings.framewidth;
            this.pos.x  = x + width - settings.framewidth;

            // apply gravity setting if specified
            this.body.gravity.y = settings.gravity || me.sys.gravity;

            this.walkLeft = false;

            // body walking & flying speed
            this.body.force.set(settings.velX || 1, settings.velY || 0);
            this.body.setMaxVelocity(settings.velX || 1, settings.velY || 0);

            // set a "enemyObject" type
            this.body.collisionType = me.collision.types.ENEMY_OBJECT;

            // don't update the entities when out of the viewport
            this.alwaysUpdate = false;

            // a specific flag to recognize these enemies
            this.isMovingEnemy = true;
        },
   
        // manage the enemy movement
        update : function (dt)
        {
            if (this.alive)    {
                if (this.walkLeft && this.pos.x <= this.startX) {
                    this.body.force.x = Math.abs(this.body.force.x);
                    this.walkLeft = false;
                    this.renderable.flipX(false);
                } else if (!this.walkLeft && this.pos.x >= this.endX) {
                    this.body.force.x = -Math.abs(this.body.force.x);
                    this.walkLeft = true;
                    this.renderable.flipX(true);
                }
    
                // check & update movement
                this.body.update(dt);
    
            }
    
            // return true if we moved of if flickering
            return (this._super(me.Entity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
        },
   
        /**
         * colision handler
         * (called when colliding with other objects)
         */
        onCollision : function (response, other) {
            if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
                // make it dead
                this.alive = false;
                //avoid further collision and delete it
                this.body.setCollisionMask(me.collision.types.NO_OBJECT);
                // make it flicker and call destroy once timer finished
                var self = this;
                this.renderable.flicker(750, function () {
                    me.game.world.removeChild(self);
                });
                // dead sfx
                me.audio.play("stomp", false);
                // give some score
                game.data.score += 150;
            }
            // Make all other objects solid
            return true;
        }
    });