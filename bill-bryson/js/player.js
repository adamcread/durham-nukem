export default class Player {
    constructor(scene, x, y, hitboxes, floor) {
        this.hitboxes = hitboxes
        this.scene = scene;
        // this.sprite = scene.matter.add.sprite(0, 0, "player", 0);
        this.sprite = scene.matter.add.sprite(x, y, 'sheet', 'gunguy-1.png', { shape: hitboxes.player })
        this.projectiles = [];

        this.sprite
            .setScale(1.5)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(x, y);

        const anims = scene.anims;
        anims.create({
            key: "player-idle",
            // frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frames: [
                { key: 'sheet', frame: 'gunguy-0.png'},
                { key: 'sheet', frame: 'gunguy-1.png'},
                { key: 'sheet', frame: 'gunguy-2.png'},
                { key: 'sheet', frame: 'gunguy-3.png'},
            ],
            frameRate: 4,
            repeat: -1
        });

        anims.create({
            key: "run",
            frames: [
                { key: 'sheet', frame: 'gunguy-7.png'},
                { key: 'sheet', frame: 'gunguy-8.png'},
                { key: 'sheet', frame: 'gunguy-9.png'},
                { key: 'sheet', frame: 'gunguy-10.png'},
                { key: 'sheet', frame: 'gunguy-11.png'},
                { key: 'sheet', frame: 'gunguy-12.png'},
                { key: 'sheet', frame: 'gunguy-13.png'},
            ],
            frameRate: 10,
            repeat: -1
        });

        scene.matterCollision.addOnCollideActive({
            objectA: this.sprite,
            objectB: scene.platformLayer,
            callback: this.touchingFloor,
            context: this
        });
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.leftInput = this.cursors.left
        this.rightInput = this.cursors.right
        this.jumpInput = this.cursors.up
        this.downInput = this.cursors.down
        this.canJump = true
        this.canFire = true
        
        this.destroyed = false;
        this.scene.events.on("update", this.update, this);

        
    }

    update() {  
        // console.log(this.scene.gravity)
        if (this.destroyed) return;
    
        const sprite = this.sprite;
        const isRightKeyDown = this.rightInput.isDown;
        const isLeftKeyDown = this.leftInput.isDown;
        const isJumpKeyDown = this.jumpInput.isDown;
        const isDownKeyDown = this.downInput.isDown;
        const isOnGround = this.isOnGround;
    
        if (!isLeftKeyDown && !isRightKeyDown && !isJumpKeyDown) {
            sprite.anims.play("player-idle", true);
        }

        if (isLeftKeyDown) {
            sprite.anims.play("run", true);
            sprite.setFlipX(true);
            sprite.setVelocityX(-2);
        
        } else if (isRightKeyDown) {
            sprite.anims.play("run", true);
            sprite.setFlipX(false);
            sprite.setVelocityX(2);
        }
    
        // --- Move the player vertically ---
        if (isJumpKeyDown && this.canJump && isOnGround) {
            sprite.setVelocityY(-10);
    
            // Add a slight delay between jumps since the bottom sensor will still collide for a few
            // frames after a jump is initiated
            this.canJump = false;
            this.isOnGround = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canJump = true)
            });
        }

        if (isDownKeyDown && this.canFire) {
            let d = 1
            if (this.sprite.flipX) {
                d = -1
            }
            this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x+100*d, this.sprite.y, 
                'sheet', 'gunguy-1.png', 
                { shape: this.hitboxes.player })
                .setVelocityX(10*d)
                .setIgnoreGravity(true));
            
            console.log(this.projectiles);

            this.canFire = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canFire = true)
            });

            this.projectiles.forEach(projectile => 
                this.scene.matterCollision.addOnCollideStart({
                    objectA: projectile,
                    callback: this.deleteProjectile,
                    context: projectile
                })
            );
        }
    }

    touchingFloor() {
        this.isOnGround = true;
    }

    deleteProjectile() {
        this.destroy()
    }
}
