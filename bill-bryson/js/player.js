export default class Player {
    constructor(scene, x, y, shapes) {
        this.x = x
        this.y = y
        this.hitboxes = shapes
        this.scene = scene;
        this.sprite = scene.matter.add.sprite(x, y, 'sheet', 'gunguy-1.png', { shape: this.hitboxes.player })
        this.projectiles = [];

        this.sprite
            .setScale(1.5)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(x, y);

        const anims = scene.anims;
        anims.create({
            key: "player-idle",
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
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.leftInput = this.cursors.left
        this.rightInput = this.cursors.right
        this.jumpInput = this.cursors.up
        this.downInput = this.cursors.down
        this.canJump = true
        this.canFire = true
        this.onGround = true
        this.health = 3;
        
        this.destroyed = false;
        this.scene.events.on("update", this.update, this);
    }

    update() {  
        if (this.destroyed) return;
    
        const sprite = this.sprite;
        const isRightKeyDown = this.rightInput.isDown;
        const isLeftKeyDown = this.leftInput.isDown;
        const isJumpKeyDown = this.jumpInput.isDown;
        const isDownKeyDown = this.downInput.isDown;
    
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
        if (isJumpKeyDown && this.canJump && this.onGround) {
            sprite.setVelocityY(-10);

            this.canJump = false;
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

            this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x+15*d, this.sprite.y-3, 
                'bullet')
                .setScale(0.2)
                .setVelocityX(10*d)
                .setIgnoreGravity(true));

            this.canFire = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canFire = true)
            });  
        }

        if (this.sprite.body.velocity.y) {
            this.onGround = false;
        } else {
            this.onGround = true;
        }

        for (let i = 0; i < this.projectiles.length; i++) {
            if (this.projectiles[i].scene == undefined) {
                this.projectiles.splice(i, 1)
            }
        }
    }
}
