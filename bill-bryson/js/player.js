export default class Player {
    constructor(scene, x, y, hitboxes, floor) {
        this.scene = scene;
        // this.sprite = scene.matter.add.sprite(0, 0, "player", 0);
        this.sprite = scene.matter.add.sprite(x, y, 'sheet', 'gunguy-1.png', { shape: hitboxes.player })

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
        })

        scene.matterCollision.addOnCollideActive({
            objectA: this.sprite,
            objectB: scene.platformLayer,
            callback: touchingFloor,
            context: this
        });
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.leftInput = this.cursors.left
        this.rightInput = this.cursors.right
        this.jumpInput = this.cursors.up
        this.canJump = true
        
        this.destroyed = false;
        this.scene.events.on("update", this.update, this);
    }

    update() {  
        if (this.destroyed) return;
    
        const sprite = this.sprite;
        const isRightKeyDown = this.rightInput.isDown;
        const isLeftKeyDown = this.leftInput.isDown;
        const isJumpKeyDown = this.jumpInput.isDown;
        const isOnGround = this.isOnGround;
        // console.log(isOnGround)
        // const isInAir = !isOnGround;
    
        // --- Move the player horizontally ---
    
        // Adjust the movement so that the player is slower in the air
        // const moveForce = isOnGround ? 1 : 0.005;
        // console.log(velocity);
    
        if (!isLeftKeyDown && !isRightKeyDown && !isJumpKeyDown) {
            sprite.anims.play("player-idle", true);
        }

        if (isLeftKeyDown) {
            sprite.anims.play("run", true);
            sprite.setFlipX(true);
            sprite.setVelocityX(-2);

            // Don't let the player push things left if they in the air
            // if (!(isInAir && this.isTouching.left)) {
            //     sprite.applyForce({ x: -moveForce, y: 0 });
            // }
        
        } else if (isRightKeyDown) {
            sprite.anims.play("run", true);
            sprite.setFlipX(false);
            sprite.setVelocityX(2);
            
            // Don't let the player push things right if they in the air
            // if (!(isInAir && this.isTouching.right)) {
            //     sprite.applyForce({ x: moveForce, y: 0 });
            // }
        }
    
        // --- Move the player vertically ---
    
        if (isJumpKeyDown && this.canJump && isOnGround) {
            sprite.setVelocityY(-10);
    
            // Add a slight delay between jumps since the bottom sensor will still collide for a few
            // frames after a jump is initiated
            this.canJump = false;
            this.isOnGround = false;
            console.log(isOnGround)
            this.jumpCooldownTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canJump = true)
            });
        }
    
        // Update the animation/texture based on the state of the player's state
        // if (isOnGround) {
        //     if (sprite.body.force.x !== 0) sprite.anims.play("player-run", true);
        //     else sprite.anims.play("player-idle", true);
        // } else {
        //     sprite.anims.stop();
        //     sprite.setTexture("player", 10);
        // }
      }
}

function touchingFloor() {
    console.log(this.isOnGround)
    this.isOnGround = true;
}