export default class Player {
    constructor(scene, x, y) {
        this.x = x;
        this.y = y;
        this.scene = scene;

        // add player sprite
        this.sprite = scene.matter.add.sprite(x, y, 'sheet', 'gunguy-1.png', { shape: scene.hitboxes.player })
            .setScale(1.5)
            .setFixedRotation()
            .setPosition(x, y);

        // create player idle animation
        scene.anims.create({
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

        // create player running animation
        scene.anims.create({
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
        
        // create listener for key presses
        const cursors = scene.input.keyboard.createCursorKeys();
        this.leftInput = cursors.left;
        this.rightInput = cursors.right;
        this.upInput = cursors.up;
        this.downInput = cursors.down;

        // initialise player variables
        this.canJump = true;
        this.canFire = true;
        this.onGround = true;
        this.projectiles = [];
        this.hearts = [];

        // define health of player
        this.spawnHealth = 3;
        
        // run this.update when scene updates occur
        scene.events.on("update", this.update, this);
    }

    update() {  
        // delete hearts in previous x y positions so that they can be redefined in new positions
        this.hearts.forEach(heart => 
            heart.destroy()
        );
        // remove deleted hearts from list
        this.hearts = [];

        // add new hearts in updated positions which track player movement
        for (let i = 0; i < this.health; i++) {
            this.hearts.push(this.scene.add.image(this.sprite.x - 25 + i*20, this.sprite.y-40, 'heart'));
        }

        // if player y velocity is 0 player is on the ground
        if (this.sprite.body.velocity.y) {
            this.onGround = false;
        } else {
            this.onGround = true;
        }
    
        // add key press variables
        const sprite = this.sprite;
        const isRightKeyDown = this.rightInput.isDown;
        const isLeftKeyDown = this.leftInput.isDown;
        const isJumpKeyDown = this.upInput.isDown;
        const isDownKeyDown = this.downInput.isDown;
    
        // play idle animation
        if (!isLeftKeyDown && !isRightKeyDown) {
            sprite.anims.play("player-idle", true);
        }

        // play running animation and add x velocity in appropriate direction
        if (isLeftKeyDown) {
            sprite.anims.play("run", true);
            sprite.setFlipX(true);
            sprite.setVelocityX(-2);
        } else if (isRightKeyDown) {
            sprite.anims.play("run", true);
            sprite.setFlipX(false);
            sprite.setVelocityX(2);
        }

        // player can jump on up key press if jump timer has ended and player is on the ground
        if (isJumpKeyDown && this.canJump && this.onGround) {
            sprite.setVelocityY(-10);

            // add jump timer
            this.canJump = false;
            this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canJump = true)
            });
        }

        // player can fire on down key press if fire timer has ended
        if (isDownKeyDown && this.canFire) {
            // d represents the direction that the player is currently facing
            let d = (!this.sprite.flipX) ? 1 : -1

            // spawn bullet in appropriate direction with appropriate velocty
            // add bullet to projectile list which tracks all player bullets currently on screen
            this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x+15*d, this.sprite.y-3, 'bullet')
                .setScale(0.2)
                .setVelocityX(10*d)
                .setIgnoreGravity(true));

            // add fire timer
            this.canFire = false;
            this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canFire = true)
            });  
        }

        // remove destroyed bullets from projectiles list
        for (let i = 0; i < this.projectiles.length; i++) {
            if (this.projectiles[i].scene == undefined) {
                this.projectiles.splice(i, 1)
            }
        }
    }
}
