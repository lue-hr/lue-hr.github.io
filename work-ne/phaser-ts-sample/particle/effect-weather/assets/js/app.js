var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FeatureSample;
(function (FeatureSample) {
    var Singleton = /** @class */ (function () {
        function Singleton() {
        }
        return Singleton;
    }());
    FeatureSample.Singleton = Singleton;
})(FeatureSample || (FeatureSample = {}));
/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />
window.onload = function () {
    var config = {
        width: 600,
        height: 400,
        renderer: Phaser.CANVAS,
        parent: 'content',
        resolution: 1,
        forceSetTimeOut: false
    };
    new FeatureSample.MainGame(config);
};
var FeatureSample;
(function (FeatureSample) {
    var MainGame = /** @class */ (function (_super) {
        __extends(MainGame, _super);
        function MainGame(config) {
            var _this = _super.call(this, config) || this;
            _this.state.add('Sample', FeatureSample.ParticleWeatherSample);
            _this.state.start('Sample');
            return _this;
        }
        return MainGame;
    }(Phaser.Game));
    FeatureSample.MainGame = MainGame;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var ObjectSampleState = /** @class */ (function (_super) {
        __extends(ObjectSampleState, _super);
        function ObjectSampleState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ObjectSampleState.prototype.preload = function () {
            this.game.load.image('arrow', 'assets/sprites/arrow.png');
            this.game.load.shader('blueDots', 'assets/shaders/blue-dots.frag');
            this.game.load.shader('bacteria', 'assets/shaders/bacteria.frag');
        };
        ObjectSampleState.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.P2JS);
            this.sampleObject = this.game.add.sprite(200, 200, 'arrow');
            this.sampleObject.anchor.set(0.5, 0.5);
            // 오브젝트 회전 시 기준 값을 지정합니다.
            // this.sampleObject.pivot.x = 10;
            // this.sampleObject.pivot.y = 10;
            this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('blueDots'));
            this.filter.setResolution(800, 600);
            this.sprite = this.game.add.sprite();
            this.sprite.width = 800;
            this.sprite.height = 600;
            this.sprite.filters = [this.filter];
        };
        ObjectSampleState.prototype.update = function () {
            // 매 프레임 업데이트 될 때마다 지정된 pivot값을 기준으로 0.05 라디안 만큼 회전합니다.
            //this.sampleObject.rotation += 0.05;
            //this.sampleObject.scale.x *= 1.01;
            this.filter.update();
        };
        ObjectSampleState.prototype.render = function () {
            // 샘플 이미지의 중심점을 표시합니다.
            this.game.debug.geom(new Phaser.Point(this.sampleObject.x, this.sampleObject.y), '#ffff00');
            this.game.debug.geom(new Phaser.Rectangle(this.sampleObject.x, this.sampleObject.y, this.sampleObject.width, this.sampleObject.height), '#ff0000');
        };
        return ObjectSampleState;
    }(Phaser.State));
    FeatureSample.ObjectSampleState = ObjectSampleState;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var AnimationSpriteAtlasSample = /** @class */ (function (_super) {
        __extends(AnimationSpriteAtlasSample, _super);
        function AnimationSpriteAtlasSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnimationSpriteAtlasSample.prototype.preload = function () {
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
            // Atlas 로드 - JSON이나 XML 방식 중 선택
            //this.load.atlas('octopus', 'assets/sprites/octopus.png', 'assets/sprites/octopus.json');
            this.load.atlasXML('octopus', 'assets/sprites/octopus.png', 'assets/sprites/octopus.xml');
        };
        AnimationSpriteAtlasSample.prototype.create = function () {
            var _this = this;
            this.infoText = this.add.text(32, 32, 'Animation started', { fill: 'white' });
            this.frameText = this.add.text(400, 32, "Frame 1", { font: "28px Arial", fill: "#ff0044" });
            this.sprite = this.add.sprite(100, 100, 'octopus');
            // Atlas 경우 generateFrameNames()를 사용하여 아틀라스 데이터에서 규칙에 맞는 스트링을 찾아 프레임 배열(swim0000 ~ swim0024)을 만들어 애니메이션을 추가합니다.
            this.swimAnim = this.sprite.animations.add('swim', Phaser.Animation.generateFrameNames('swim', 0, 24, '', 4), 30, true);
            this.sprite.animations.play('swim');
            // Animation Event 사용 관련
            this.swimAnim.onStart.add(this.animationStarted, this); // 애니메이션이 시작할 때 호출
            this.swimAnim.onLoop.add(this.animationLooped, this); // 애니메이션이 Loop로 설정되어, 다시 반복될 때 시작 호출
            this.swimAnim.onComplete.add(this.animationStopped, this); // 애니메이션이 재생이 완료되면 호출. Loop인 경우 호출되지 않음
            this.swimAnim.enableUpdate = true; // onUpdate를 사용하기 위해 true로 변경
            this.swimAnim.onUpdate.add(this.animationUpdate, this); // 프레임이 변경되면 호출
            // Play
            this.makeButton('Play', 800, 100, function () {
                if (!_this.swimAnim.isPlaying) {
                    _this.sprite.animations.play('swim');
                }
            });
            // Stop
            this.makeButton('Stop', 800, 140, function () {
                if (_this.swimAnim.isPlaying) {
                    _this.sprite.animations.stop('swim');
                }
            });
            // Loop
            this.makeButton('Loop', 800, 180, function () {
                _this.swimAnim.loop = !_this.swimAnim.loop;
            });
        };
        AnimationSpriteAtlasSample.prototype.animationStarted = function (sprite, animation) {
            this.infoText.text = 'Animation started';
        };
        AnimationSpriteAtlasSample.prototype.animationLooped = function (sprite, animation) {
            this.infoText.text = 'Animation looped';
        };
        AnimationSpriteAtlasSample.prototype.animationStopped = function (sprite, animation) {
            this.infoText.text = 'Animation stoped';
        };
        AnimationSpriteAtlasSample.prototype.animationUpdate = function (animation, frame) {
            this.frameText.text = 'Frame ' + frame.index;
        };
        // 테스트를 위한 버튼 생성
        AnimationSpriteAtlasSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 16 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return AnimationSpriteAtlasSample;
    }(Phaser.State));
    FeatureSample.AnimationSpriteAtlasSample = AnimationSpriteAtlasSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var AnimationSpriteSheetSample = /** @class */ (function (_super) {
        __extends(AnimationSpriteSheetSample, _super);
        function AnimationSpriteSheetSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnimationSpriteSheetSample.prototype.preload = function () {
            this.load.spritesheet('spaceman', 'assets/sprites/spaceman.png', 16, 16);
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        AnimationSpriteSheetSample.prototype.create = function () {
            var _this = this;
            /* SpriteSheet */
            this.sprite = this.add.sprite(150, 100, 'spaceman');
            this.sprite.scale.set(4);
            // SpriteSheet의 경우 동작에 맞는 프레임 인덱스를 배열로 넘겨 애니메이션을 추가합니다.
            this.sprite.animations.add('left', [8, 9], 10, true);
            this.sprite.animations.add('right', [1, 2], 10, true);
            this.sprite.animations.add('up', [11, 12, 13], 10, true);
            this.sprite.animations.add('down', [4, 5, 6], 10, true);
            this.currentAnim = this.sprite.animations.play('left');
            // Play
            this.makeButton('Play', 420, 100, function () {
                if (!_this.currentAnim.isPlaying) {
                    _this.sprite.animations.play('left');
                }
            });
            // Stop
            this.makeButton('Stop', 420, 140, function () {
                if (_this.currentAnim.isPlaying) {
                    _this.sprite.animations.stop('left');
                }
            });
            // Loop
            this.makeButton('Loop', 420, 180, function () {
                _this.currentAnim.loop = !_this.currentAnim.loop;
            });
        };
        AnimationSpriteSheetSample.prototype.render = function () {
            this.game.debug.text('isPlaying = ' + this.currentAnim.isPlaying + ', Loop = ' + this.currentAnim.loop, 32, 32);
            this.game.debug.text('frame= ' + this.currentAnim.frame, 32, 64);
        };
        // 테스트를 위한 버튼 생성
        AnimationSpriteSheetSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 16 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return AnimationSpriteSheetSample;
    }(Phaser.State));
    FeatureSample.AnimationSpriteSheetSample = AnimationSpriteSheetSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var AudioFadeSample = /** @class */ (function (_super) {
        __extends(AudioFadeSample, _super);
        function AudioFadeSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AudioFadeSample.prototype.preload = function () {
            this.load.audio('boden', 'assets/audio/goaman_intro.mp3');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        AudioFadeSample.prototype.create = function () {
            var _this = this;
            this.music = this.add.audio('boden');
            // Fade In - 4000ms동안 사운드 볼륨을 0에서 1로 변경합니다.
            this.makeButton('fadeIn', 420, 80, function () {
                _this.music.fadeIn(4000);
            });
            // Fade In - 4000ms동안 사운드 볼륨을 1에서 0로 변경합니다.
            this.makeButton('fadeOut', 420, 120, function () {
                _this.music.fadeOut(4000);
            });
        };
        AudioFadeSample.prototype.render = function () {
            this.game.debug.soundInfo(this.music, 30, 40);
        };
        // 테스트를 위한 버튼 생성
        AudioFadeSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return AudioFadeSample;
    }(Phaser.State));
    FeatureSample.AudioFadeSample = AudioFadeSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var AudioSample = /** @class */ (function (_super) {
        __extends(AudioSample, _super);
        function AudioSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AudioSample.prototype.preload = function () {
            this.load.audio("GameMusic", ["assets/audio/tommy_in_goa.mp3"]);
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        AudioSample.prototype.create = function () {
            var _this = this;
            this.sampleSound = this.add.audio('GameMusic');
            //
            this.sampleSound.onPlay.add(function () {
                console.log("Played");
            });
            this.sampleSound.onPause.add(function () {
                console.log("Paused");
            });
            // Play
            this.makeButton('Play', 420, 40, function () {
                if (_this.sampleSound.currentTime > 0)
                    _this.sampleSound.resume();
                else
                    _this.sampleSound.play();
            });
            // Pause
            this.makeButton('Pause', 420, 80, function () {
                if (_this.sampleSound.isPlaying) {
                    _this.sampleSound.pause();
                }
                else {
                    _this.sampleSound.resume();
                }
            });
            // Stop
            this.makeButton('Stop', 420, 120, function () {
                if (_this.sampleSound.isPlaying) {
                    _this.sampleSound.stop();
                    _this.sampleSound.currentTime = 0;
                }
            });
            // Volume Up
            this.makeButton('Vol +', 420, 180, function () {
                _this.sampleSound.volume += 0.1;
            });
            // Volume Down
            this.makeButton('Vol -', 420, 220, function () {
                _this.sampleSound.volume -= 0.1;
            });
            // Mute
            this.makeButton('Mute', 420, 260, function () {
                // Global mute!  Use this.sampleSound.mute to mute a single sound
                _this.sampleSound.mute = !_this.sampleSound.mute;
            });
        };
        AudioSample.prototype.render = function () {
            this.game.debug.soundInfo(this.sampleSound, 30, 40);
        };
        // 테스트를 위한 버튼 생성
        AudioSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return AudioSample;
    }(Phaser.State));
    FeatureSample.AudioSample = AudioSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var AudioSpriteSample = /** @class */ (function (_super) {
        __extends(AudioSpriteSample, _super);
        function AudioSpriteSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AudioSpriteSample.prototype.preload = function () {
            this.load.audio('sfx', 'assets/audio/SoundEffects/fx_mixdown.ogg');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        AudioSpriteSample.prototype.create = function () {
            this.sampleSound = this.add.audio('sfx');
            this.sampleSound.allowMultiple = true;
            // addMarker를 이용하여 지정할 부분의 이름, 시작 시간, 지속 시간을 설정합니다.
            this.sampleSound.addMarker('alien death', 1, 1.0);
            this.sampleSound.addMarker('boss hit', 3, 0.5);
            this.sampleSound.addMarker('escape', 4, 3.2);
            this.sampleSound.addMarker('meow', 8, 0.5);
            this.sampleSound.addMarker('numkey', 9, 0.1);
            this.sampleSound.addMarker('ping', 10, 1.0);
            this.sampleSound.addMarker('death', 12, 4.2);
            this.sampleSound.addMarker('shot', 17, 1.0);
            this.sampleSound.addMarker('squit', 19, 0.3);
            // 위에서 지정한 Marker의 사운드를 플레이합니다. 버튼의 이름은 Marker의 이름입니다.
            this.makeButton('alien death', 420, 30, this.click);
            this.makeButton('boss hit', 420, 70, this.click);
            this.makeButton('escape', 420, 110, this.click);
            this.makeButton('meow', 420, 150, this.click);
            this.makeButton('numkey', 420, 190, this.click);
            this.makeButton('ping', 420, 230, this.click);
            this.makeButton('death', 420, 270, this.click);
            this.makeButton('shot', 420, 310, this.click);
            this.makeButton('squit', 420, 350, this.click);
        };
        AudioSpriteSample.prototype.click = function (button) {
            this.sampleSound.play(button.name);
        };
        AudioSpriteSample.prototype.render = function () {
            this.game.debug.soundInfo(this.sampleSound, 30, 40);
        };
        // 테스트를 위한 버튼 생성
        AudioSpriteSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return AudioSpriteSample;
    }(Phaser.State));
    FeatureSample.AudioSpriteSample = AudioSpriteSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var AudioSpriteSampleJson = /** @class */ (function (_super) {
        __extends(AudioSpriteSampleJson, _super);
        function AudioSpriteSampleJson() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AudioSpriteSampleJson.prototype.preload = function () {
            this.load.audiosprite('sfx', ['assets/audio/SoundEffects/fx_mixdown.ogg'], 'assets/audio/SoundEffects/fx_mixdown.json');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        AudioSpriteSampleJson.prototype.create = function () {
            this.audioSprite = this.add.audioSprite('sfx');
            // Json에서 지정된 Marker의 사운드를 플레이합니다. 버튼의 이름은 Marker의 이름입니다.
            this.makeButton('alien death', 420, 30, this.click);
            this.makeButton('boss hit', 420, 70, this.click);
            this.makeButton('escape', 420, 110, this.click);
            this.makeButton('meow', 420, 150, this.click);
            this.makeButton('numkey', 420, 190, this.click);
            this.makeButton('ping', 420, 230, this.click);
            this.makeButton('death', 420, 270, this.click);
            this.makeButton('shot', 420, 310, this.click);
            this.makeButton('squit', 420, 350, this.click);
        };
        AudioSpriteSampleJson.prototype.click = function (button) {
            this.currentSound = this.audioSprite.play(button.name);
        };
        AudioSpriteSampleJson.prototype.render = function () {
            if (this.currentSound) {
                this.game.debug.soundInfo(this.currentSound, 30, 40);
            }
        };
        // 테스트를 위한 버튼 생성
        AudioSpriteSampleJson.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return AudioSpriteSampleJson;
    }(Phaser.State));
    FeatureSample.AudioSpriteSampleJson = AudioSpriteSampleJson;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var CameraEffectSample = /** @class */ (function (_super) {
        __extends(CameraEffectSample, _super);
        function CameraEffectSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CameraEffectSample.prototype.preload = function () {
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        CameraEffectSample.prototype.create = function () {
            var _this = this;
            this.stage.backgroundColor = 0xEEEEEE;
            // 각 효과가 끝났을 때 처리를 연결
            this.camera.onFadeComplete.add(function () {
                _this.camera.resetFX(); // 화면 효과 초기화
                console.log('fade complete');
            });
            this.camera.onFlashComplete.add(function () {
                console.log('flash complete');
            });
            this.camera.onShakeComplete.add(function () {
                console.log('shake complete');
            });
            // 테스트를 위한 버튼 생성 - 버튼에 필요한 기능 연결
            this.makeButton('fade', 420, 100, function () {
                // 1000ms 동안 검은색으로 화면 페이드 적용
                _this.camera.fade(0x000000, 1000);
            });
            this.makeButton('flash', 420, 140, function () {
                // 1000ms 동안 빨간색으로 화면 플래시 적용
                _this.camera.flash(0xff0000, 1000);
            });
            this.makeButton('shake', 420, 220, function () {
                // 500ms 동안 카메라 0.05 강도로 쉐이크 적용
                // (흔들림 강도는 카메라가 움직일 수 있는 최대거리를 나타내는 카메라 크기의 백분율)
                _this.camera.shake(0.05, 500);
            });
        };
        // 테스트를 위한 버튼 생성
        CameraEffectSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return CameraEffectSample;
    }(Phaser.State));
    FeatureSample.CameraEffectSample = CameraEffectSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var CameraMoveType;
    (function (CameraMoveType) {
        CameraMoveType[CameraMoveType["Player"] = 0] = "Player";
        CameraMoveType[CameraMoveType["Camera"] = 1] = "Camera";
    })(CameraMoveType || (CameraMoveType = {}));
    var CameraMoveSample = /** @class */ (function (_super) {
        __extends(CameraMoveSample, _super);
        function CameraMoveSample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.moveSpeed = 5;
            return _this;
        }
        CameraMoveSample.prototype.preload = function () {
            this.load.image('background', 'assets/sprites/debug-grid-1920x1920.png');
            this.load.image('player', 'assets/sprites/phaser-dude.png');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        CameraMoveSample.prototype.create = function () {
            var _this = this;
            this.add.tileSprite(0, 0, 1920, 1920, 'background');
            this.player = this.add.sprite(this.world.centerX, this.world.centerY, 'player');
            this.player.anchor.set(0.5);
            this.physics.startSystem(Phaser.Physics.P2JS);
            this.physics.p2.enable(this.player);
            this.cursors = this.input.keyboard.createCursorKeys();
            // 월드 크기 설정
            this.world.setBounds(0, 0, 1920, 1920);
            // 기본 설정
            this.moveType = CameraMoveType.Player;
            this.deadzoneRect = new Phaser.Rectangle(100, 100, this.scale.width - 200, this.scale.height - 200);
            // 플레이어 이동 / 카메라 이동 토글
            this.makeButton('change moveType', 420, 40, function () {
                _this.moveType = (_this.moveType == CameraMoveType.Player) ? CameraMoveType.Camera : CameraMoveType.Player;
            });
            // 카메라가 플레이어 오브젝트를 따라다니도록 지정 토글
            this.makeButton('follow', 420, 100, function () {
                if (_this.camera.target) {
                    _this.camera.follow(null);
                }
                else {
                    _this.camera.follow(_this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
                }
            });
            // 데드존 활성 토글
            this.makeButton('deadzone', 420, 140, function () {
                if (!_this.camera.deadzone) {
                    _this.camera.deadzone = _this.deadzoneRect;
                }
                else {
                    _this.camera.deadzone = null;
                }
            });
            // 플레이어에 포커스가 맞춰지도록 조정
            this.makeButton('focus', 420, 180, function () {
                _this.camera.focusOn(_this.player);
            });
        };
        CameraMoveSample.prototype.update = function () {
            switch (this.moveType) {
                case CameraMoveType.Player:
                    {
                        this.player.body.setZeroVelocity();
                        if (this.cursors.up.isDown) {
                            this.player.body.moveUp(300);
                        }
                        else if (this.cursors.down.isDown) {
                            this.player.body.moveDown(300);
                        }
                        if (this.cursors.left.isDown) {
                            this.player.body.moveLeft(300);
                        }
                        else if (this.cursors.right.isDown) {
                            this.player.body.moveRight(300);
                        }
                    }
                    break;
                case CameraMoveType.Camera:
                    {
                        if (this.cursors.up.isDown) {
                            this.camera.y += this.moveSpeed;
                        }
                        else if (this.cursors.down.isDown) {
                            this.camera.y -= this.moveSpeed;
                        }
                        if (this.cursors.left.isDown) {
                            this.camera.x -= this.moveSpeed;
                        }
                        else if (this.cursors.right.isDown) {
                            this.camera.x += this.moveSpeed;
                        }
                    }
                    break;
            }
        };
        CameraMoveSample.prototype.render = function () {
            var deadzone = this.camera.deadzone;
            if (deadzone) {
                this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
                this.game.context.fillRect(deadzone.x, deadzone.y, deadzone.width, deadzone.height);
            }
            this.game.debug.text('Move Type = ' + CameraMoveType[this.moveType], 32, 32);
            this.game.debug.cameraInfo(this.camera, 32, 60);
            this.game.debug.spriteCoords(this.player, 32, 500);
        };
        // 테스트를 위한 버튼 생성
        CameraMoveSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            button.fixedToCamera = true;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
            label.fixedToCamera = true;
        };
        return CameraMoveSample;
    }(Phaser.State));
    FeatureSample.CameraMoveSample = CameraMoveSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var GroupAlignSample = /** @class */ (function (_super) {
        __extends(GroupAlignSample, _super);
        function GroupAlignSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupAlignSample.prototype.preload = function () {
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
            this.load.bitmapFont('nokia', 'assets/fonts/bitmapFonts/nokia16black.png', 'assets/fonts/bitmapFonts/nokia16black.xml');
            this.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');
        };
        GroupAlignSample.prototype.create = function () {
            //this.add.sprite(0, 0, this.create.grid('grid', 140 * 5, 140 * 3, 140, 140, 'rgba(0, 250, 0, 1)'));
            var _this = this;
            this.group = this.add.group();
            this.group.createMultiple(5, 'seacreatures', ['blueJellyfish0000', 'crab10000', 'flyingFish0000'], true);
            this.makeButton('center', 800, 100, function () { _this.group.align(5, 3, 140, 140, Phaser.CENTER); });
            this.makeButton('top-right', 800, 140, function () { _this.group.align(5, 3, 140, 140, Phaser.TOP_RIGHT); });
            this.makeButton('top-left', 800, 180, function () { _this.group.align(5, 3, 140, 140, Phaser.TOP_LEFT); });
            this.makeButton('top', 800, 220, function () { _this.group.align(5, 3, 140, 140, Phaser.TOP_CENTER); });
            this.makeButton('bottom-left', 800, 260, function () { _this.group.align(5, 3, 140, 140, Phaser.BOTTOM_LEFT); });
            this.makeButton('bottom-right', 800, 300, function () { _this.group.align(5, 3, 140, 140, Phaser.BOTTOM_RIGHT); });
            this.makeButton('bottom', 800, 340, function () { _this.group.align(5, 3, 140, 140, Phaser.BOTTOM_CENTER); });
            this.makeButton('left', 800, 380, function () { _this.group.align(5, 3, 140, 140, Phaser.LEFT); });
            this.makeButton('right', 800, 420, function () { _this.group.align(5, 3, 140, 140, Phaser.RIGHT); });
        };
        // 테스트를 위한 버튼 생성
        GroupAlignSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.bitmapText(x, y + 7, 'nokia', name, 16);
            label.x += (button.width / 2) - (label.textWidth / 2);
        };
        GroupAlignSample.prototype.groupAlign = function (position) {
            this.group.align(5, 3, 140, 140, position);
        };
        return GroupAlignSample;
    }(Phaser.State));
    FeatureSample.GroupAlignSample = GroupAlignSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var GroupCallAllSample = /** @class */ (function (_super) {
        __extends(GroupCallAllSample, _super);
        function GroupCallAllSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupCallAllSample.prototype.preload = function () {
            this.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
            this.load.bitmapFont('nokia', 'assets/fonts/bitmapFonts/nokia16black.png', 'assets/fonts/bitmapFonts/nokia16black.xml');
        };
        GroupCallAllSample.prototype.create = function () {
            var _this = this;
            this.coins = this.add.group();
            // 그룹에 사용할 코인 50개를 생성합니다.
            for (var i = 0; i < 50; i++) {
                this.coins.create(this.world.randomX, this.world.randomY, 'coin', 0);
            }
            // 그룹 안에 있는 모든 코인 스프라이트의 animation.add를 호출합니다.
            this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
            // 그룹 애니메이션을 위한 테스트 버튼을 생성합니다.
            this.makeButton('animations.play', 800, 100, function () {
                _this.coins.callAll('animations.play', 'animations', 'spin');
            });
            this.makeButton('animations.stop', 800, 140, function () {
                _this.coins.callAll('animations.stop', 'animations', 'spin');
            });
            // 그룹 오브젝트를 kill, hide 하는 테스트 버튼을 생성합니다.
            this.makeButton('kill', 800, 180, function () {
                _this.coins.callAll('kill', '');
            });
            this.makeButton('revive', 800, 220, function () {
                _this.coins.callAll('revive', '');
            });
        };
        // 테스트를 위한 버튼 생성
        GroupCallAllSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.bitmapText(x, y + 7, 'nokia', name, 16);
            label.x += (button.width / 2) - (label.textWidth / 2);
        };
        return GroupCallAllSample;
    }(Phaser.State));
    FeatureSample.GroupCallAllSample = GroupCallAllSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var GroupForeachSample = /** @class */ (function (_super) {
        __extends(GroupForeachSample, _super);
        function GroupForeachSample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.baseAlphaIncSpeed = 0.0009;
            return _this;
        }
        GroupForeachSample.prototype.preload = function () {
            this.load.spritesheet('trees', 'assets/sprites/walls_1x2.png', 32, 64);
        };
        GroupForeachSample.prototype.create = function () {
            this.group = this.add.group();
            for (var i = 0; i < 16; i++) {
                this.group.create(400, (i * 32) + Math.random(), 'trees', 0).alphaIncSpeed = this.baseAlphaIncSpeed * (i + 1);
            }
        };
        GroupForeachSample.prototype.update = function () {
            this.group.forEach(function (item) {
                item.alpha -= item.alphaIncSpeed;
                if (item.alpha < 0.0001 || item.alpha > 0.9999) {
                    item.alphaIncSpeed *= -1;
                }
            });
        };
        return GroupForeachSample;
    }(Phaser.State));
    FeatureSample.GroupForeachSample = GroupForeachSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var GroupMemberAllSample = /** @class */ (function (_super) {
        __extends(GroupMemberAllSample, _super);
        function GroupMemberAllSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupMemberAllSample.prototype.preload = function () {
            this.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
            this.load.bitmapFont('nokia', 'assets/fonts/bitmapFonts/nokia16black.png', 'assets/fonts/bitmapFonts/nokia16black.xml');
        };
        GroupMemberAllSample.prototype.create = function () {
            var _this = this;
            this.coins = this.add.group();
            // 그룹에 사용할 코인 50개를 생성합니다.
            for (var i = 0; i < 50; i++) {
                this.coins.create(this.world.randomX, this.world.randomY, 'coin', 0);
            }
            this.makeButton('visible all', 800, 100, function () {
                // 내부 오브젝트 중에 visible이 true가 아닌 경우가 있으면 전체 값을 true로 변경합니다.
                if (!_this.coins.checkAll('visible', true)) {
                    _this.coins.setAll('visible', true);
                }
            });
            this.makeButton('disable all', 800, 140, function () {
                // 내부 오브젝트 중에 visible이 false가 아닌 경우가 있으면 전체 값을 false로 변경합니다.
                if (!_this.coins.checkAll('visible', false)) {
                    _this.coins.setAll('visible', false);
                }
            });
            this.makeButton('one item visible', 800, 180, function () {
                // 내부 오브젝트 중에 visible이 false인 값을 가져와서 visible을 true로 변경합니다.
                var coin = _this.coins.getFirst('visible', false);
                if (coin) {
                    coin.visible = true;
                }
            });
            this.makeButton('one item disable', 800, 220, function () {
                // 내부 오브젝트 중에 visible이 true인 값을 가져와서 visible을 false로 변경합니다.
                var coin = _this.coins.getFirst('visible', true);
                if (coin) {
                    coin.visible = false;
                }
            });
        };
        // 테스트를 위한 버튼 생성
        GroupMemberAllSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.bitmapText(x, y + 7, 'nokia', name, 16);
            label.x += (button.width / 2) - (label.textWidth / 2);
        };
        return GroupMemberAllSample;
    }(Phaser.State));
    FeatureSample.GroupMemberAllSample = GroupMemberAllSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var GroupRecycleSample = /** @class */ (function (_super) {
        __extends(GroupRecycleSample, _super);
        function GroupRecycleSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupRecycleSample.prototype.preload = function () {
            this.load.image('baddie', 'assets/sprites/space-baddie.png');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
            this.load.bitmapFont('nokia', 'assets/fonts/bitmapFonts/nokia16black.png', 'assets/fonts/bitmapFonts/nokia16black.xml');
        };
        GroupRecycleSample.prototype.create = function () {
            this.enemies = this.add.group();
            for (var i = 0; i < 8; i++) {
                this.enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'baddie');
            }
            this.makeButton('killBaddie', 800, 100, this.killBaddie);
            this.makeButton('createBaddie', 800, 140, this.createBaddie);
        };
        GroupRecycleSample.prototype.killBaddie = function () {
            this.enemies.killAll();
        };
        GroupRecycleSample.prototype.createBaddie = function () {
            this.enemies.reviveAll();
        };
        // 테스트를 위한 버튼 생성
        GroupRecycleSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.bitmapText(x, y + 7, 'nokia', name, 16);
            label.x += (button.width / 2) - (label.textWidth / 2);
        };
        return GroupRecycleSample;
    }(Phaser.State));
    FeatureSample.GroupRecycleSample = GroupRecycleSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var GroupRenderOrderSample = /** @class */ (function (_super) {
        __extends(GroupRenderOrderSample, _super);
        function GroupRenderOrderSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupRenderOrderSample.prototype.preload = function () {
            this.load.spritesheet('trees', 'assets/sprites/walls_1x2.png', 32, 64);
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
            this.load.bitmapFont('nokia', 'assets/fonts/bitmapFonts/nokia16black.png', 'assets/fonts/bitmapFonts/nokia16black.xml');
        };
        GroupRenderOrderSample.prototype.create = function () {
            this.group = this.add.group();
            for (var i = 0; i < 16; i++) {
                this.group.create(400, (i * 32) + Math.random(), 'trees', 0);
            }
            this.shuffle();
            this.makeButton('sort - y ascending', 800, 100, this.sort_ascending);
            this.makeButton('sort - y descending', 800, 140, this.sort_descending);
            this.makeButton('shuffle', 800, 180, this.shuffle);
            this.makeButton('reverse', 800, 220, this.reverse);
        };
        GroupRenderOrderSample.prototype.sort_ascending = function () {
            this.group.sort('y', Phaser.Group.SORT_ASCENDING);
            this.printLog('sort_ascending');
        };
        GroupRenderOrderSample.prototype.sort_descending = function () {
            this.group.sort('y', Phaser.Group.SORT_DESCENDING);
            this.printLog('sort_descending');
        };
        GroupRenderOrderSample.prototype.shuffle = function () {
            this.group.shuffle();
            this.printLog('shuffle');
        };
        GroupRenderOrderSample.prototype.reverse = function () {
            this.group.reverse();
            this.printLog('reverse');
        };
        // 테스트를 위한 버튼 생성
        GroupRenderOrderSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.bitmapText(x, y + 7, 'nokia', name, 16);
            label.x += (button.width / 2) - (label.textWidth / 2);
        };
        // 테스트를 위한 그룹 내 콘솔 로그 출력
        GroupRenderOrderSample.prototype.printLog = function (summary) {
            console.log(summary);
            for (var i = 0; i < this.group.children.length; i++) {
                var child = this.group.children[i];
                if (child) {
                    console.log(child.z, '=', child.y);
                }
            }
        };
        return GroupRenderOrderSample;
    }(Phaser.State));
    FeatureSample.GroupRenderOrderSample = GroupRenderOrderSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var AlignSample = /** @class */ (function (_super) {
        __extends(AlignSample, _super);
        function AlignSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlignSample.prototype.preload = function () {
            this.load.image('rect', 'assets/sprites/32x32.png');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        AlignSample.prototype.create = function () {
            // 기준으로 삼을 사각형과 배치할 오브젝트를 생성합니다.
            this.rect = new Phaser.Rectangle(60, 50, 300, 300);
            this.sprites = this.world.createMultiple(12, 'rect', 0, true);
            // alignIn과 alignTo 테스트를 위한 버튼을 생성하고 기능을 연결합니다.
            this.makeButton('alignIn', 420, 100, this.setupAlignIn);
            this.makeButton('alignTo', 420, 140, this.setupAlignTo);
        };
        AlignSample.prototype.setupAlignIn = function () {
            for (var i = 0; i < this.sprites.length; i++) {
                var child = this.sprites[i];
                if (child) {
                    // Phaser.TOP_LEFT = 0, Phaser.TOP_CENTER = 1, Phaser.TOP_RIGHT = 2
                    // Phaser.LEFT_CENTER = 4, Phaser.CENTER = 6, Phaser.RIGHT_CENTER = 8
                    // Phaser.BOTTOM_LEFT = 10, Phaser.BOTTOM_CENTER = 11, Phaser.BOTTOM_RIGHT = 12
                    // 두번째 파라미터에 원하는 위치의 값을 선택하여 넣으면 되는데, 여기서는 일괄 처리를 위하여 number형태의 값을 넣습니다.
                    child.alignIn(this.rect, i + 1);
                }
            }
        };
        AlignSample.prototype.setupAlignTo = function () {
            for (var i = 0; i < this.sprites.length; i++) {
                var child = this.sprites[i];
                if (child) {
                    // Phaser.TOP_LEFT = 0, Phaser.TOP_CENTER = 1, Phaser.TOP_RIGHT = 2
                    // Phaser.LEFT_TOP = 3, Phaser.LEFT_CENTER = 4, Phaser.LEFT_BOTTOM = 5
                    // Phaser.RIGHT_TOP = 7, Phaser.RIGHT_CENTER = 8, Phaser.RIGHT_BOTTOM = 9
                    // Phaser.BOTTOM_LEFT = 10, Phaser.BOTTOM_CENTER = 11, Phaser.BOTTOM_RIGHT = 12
                    // 두번째 파라미터에 원하는 위치의 값을 선택하여 넣으면 되는데, 여기서는 일괄 처리를 위하여 number형태의 값을 넣습니다.
                    child.alignTo(this.rect, i + 1);
                }
            }
        };
        AlignSample.prototype.render = function () {
            // 사각형 영역을 화면에 표시합니다.
            this.game.debug.rectangle(this.rect, '#ffffff', false);
        };
        // 테스트를 위한 버튼 생성
        AlignSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 16 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return AlignSample;
    }(Phaser.State));
    FeatureSample.AlignSample = AlignSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var AlphaSample = /** @class */ (function (_super) {
        __extends(AlphaSample, _super);
        function AlphaSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlphaSample.prototype.preload = function () {
            this.load.image('bg', 'assets/misc/water_texture.jpg');
            this.load.image('bunny', 'assets/sprites/bunny.png');
        };
        AlphaSample.prototype.create = function () {
            this.add.sprite(0, 0, 'bg');
            var sampleObject = this.add.sprite(50, 50, 'bunny');
            sampleObject.alpha = 0.3;
        };
        return AlphaSample;
    }(Phaser.State));
    FeatureSample.AlphaSample = AlphaSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var MaskSample = /** @class */ (function (_super) {
        __extends(MaskSample, _super);
        function MaskSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MaskSample.prototype.preload = function () {
            this.load.image('bg', 'assets/misc/water_texture.jpg');
        };
        MaskSample.prototype.create = function () {
            this.sampleObject = this.add.sprite(0, 0, 'bg');
            // 원형으로 마스크를 생성합니다.
            this.sampleMask = this.add.graphics(0, 0);
            this.sampleMask.beginFill(0xffffff);
            this.sampleMask.drawCircle(100, 100, 100);
            // 위에서 생성한 Mask를 넣어주면 아래와 같이 출력됩니다.
            this.sampleObject.mask = this.sampleMask;
        };
        return MaskSample;
    }(Phaser.State));
    FeatureSample.MaskSample = MaskSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var ObjectRecycleSample = /** @class */ (function (_super) {
        __extends(ObjectRecycleSample, _super);
        function ObjectRecycleSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ObjectRecycleSample.prototype.preload = function () {
            this.load.image('baddie', 'assets/sprites/space-baddie.png');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        ObjectRecycleSample.prototype.create = function () {
            this.enemies = this.add.group();
            for (var i = 0; i < 8; i++) {
                this.enemies.create(120 + Math.random() * 200, 100 + Math.random() * 200, 'baddie');
            }
            this.makeButton('baddie kill', 420, 100, this.killBaddie);
            this.makeButton('baddie revive', 420, 140, this.reviveBaddie);
        };
        ObjectRecycleSample.prototype.killBaddie = function () {
            // alive 상태인 첫번째 오브젝트를 가져와서 오브젝트를 죽입니다.
            var baddie = this.enemies.getFirstAlive();
            if (baddie) {
                baddie.kill();
            }
        };
        ObjectRecycleSample.prototype.reviveBaddie = function () {
            // exists가 false 상태인 첫번째 오브젝트를 가져와서 살립니다.
            var enemy = this.enemies.getFirstExists(false);
            if (enemy) {
                enemy.revive();
            }
        };
        // 테스트를 위한 버튼 생성
        ObjectRecycleSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 16 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return ObjectRecycleSample;
    }(Phaser.State));
    FeatureSample.ObjectRecycleSample = ObjectRecycleSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var ParticleSample = /** @class */ (function (_super) {
        __extends(ParticleSample, _super);
        function ParticleSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ParticleSample.prototype.preload = function () {
            this.load.image('corona', 'assets/particles/blue.png');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        ParticleSample.prototype.create = function () {
            var _this = this;
            this.emitter = this.add.emitter(this.world.centerX, 380, 200);
            this.emitter.makeParticles('corona');
            // Emitter 효과를 지정합니다.
            this.emitter.setScale(0.5, 1);
            this.emitter.gravity.set(-200);
            this.makeButton('not explode', 420, 40, function () {
                var explode = false; // 파티클이 한번에 폭발하는지 여부
                var lifespan = 5000; // 파티클이 방출되는 시간 (단위: ms) (0으로 선택하면 반복됨)
                var frequency = 100; // 파티클 하나 당 풀어놓는 간격 (explode = false인 경우만 작동)
                var total = 30; // 파티클이 방출된 개수가 total 개수를 넘어가면 emitter가 off됨
                _this.emitter.start(explode, lifespan, frequency, total);
            });
            this.makeButton('explode', 420, 80, function () {
                var explode = true;
                var lifespan = 4000;
                var frequency = 100;
                var total = 30;
                _this.emitter.start(explode, lifespan, frequency, total);
            });
        };
        // 테스트를 위한 버튼 생성
        ParticleSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return ParticleSample;
    }(Phaser.State));
    FeatureSample.ParticleSample = ParticleSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var ParticleTrailSample = /** @class */ (function (_super) {
        __extends(ParticleTrailSample, _super);
        function ParticleTrailSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ParticleTrailSample.prototype.preload = function () {
            this.load.image('space', 'assets/misc/starfield.jpg');
            this.load.image('fire1', 'assets/particles/fire1.png');
            this.load.image('fire2', 'assets/particles/fire2.png');
            this.load.image('fire3', 'assets/particles/fire3.png');
            this.load.image('smoke', 'assets/particles/smoke-puff.png');
            this.load.spritesheet('ball', 'assets/particles/plasmaball.png', 128, 128);
        };
        ParticleTrailSample.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
            // Emitter 생성
            this.emitter = this.add.emitter(this.world.centerX, this.world.centerY, 400);
            this.emitter.makeParticles(['fire1', 'fire2', 'fire3', 'smoke']);
            this.emitter.gravity.set(200);
            this.emitter.setAlpha(1, 0, 3000);
            this.emitter.setScale(0.8, 0, 0.8, 0, 3000);
            this.emitter.start(false, 3000, 5);
            this.sprite = this.add.sprite(0, 300, 'ball', 0);
            this.physics.arcade.enable(this.sprite);
            this.physics.arcade.gravity.y = 150;
            this.physics.arcade.checkCollision.left = false;
            this.physics.arcade.checkCollision.right = false;
            this.sprite.body.setSize(80, 80, 0, 0);
            this.sprite.body.collideWorldBounds = true;
            this.sprite.body.bounce.set(1);
            this.sprite.body.velocity.set(300, 200);
            this.sprite.inputEnabled = true;
            this.sprite.input.enableDrag();
            this.sprite.events.onDragStart.add(this.onDragStart, this);
            this.sprite.events.onDragStop.add(this.onDragStop, this);
            this.sprite.animations.add('pulse');
            this.sprite.play('pulse', 30, true);
            this.sprite.anchor.set(0.5);
        };
        ParticleTrailSample.prototype.update = function () {
            var px = this.sprite.body.velocity.x;
            var py = this.sprite.body.velocity.y;
            px *= -1;
            py *= -1;
            this.emitter.minParticleSpeed.set(px, py);
            this.emitter.maxParticleSpeed.set(px, py);
            this.emitter.emitX = this.sprite.x;
            this.emitter.emitY = this.sprite.y;
            // emitter.forEachExists(game.world.wrap, game.world);
            this.world.wrap(this.sprite, 64);
        };
        ParticleTrailSample.prototype.onDragStart = function () {
            this.sprite.body.moves = false;
        };
        ParticleTrailSample.prototype.onDragStop = function () {
            this.sprite.body.moves = true;
        };
        return ParticleTrailSample;
    }(Phaser.State));
    FeatureSample.ParticleTrailSample = ParticleTrailSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var ParticleWeatherSample = /** @class */ (function (_super) {
        __extends(ParticleWeatherSample, _super);
        function ParticleWeatherSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ParticleWeatherSample.prototype.preload = function () {
            this.load.image('sky', 'assets/sprites/sky5.png');
            this.load.spritesheet('rain', 'assets/sprites/rain.png', 17, 17);
            this.load.spritesheet('snowflakes', 'assets/sprites/snowflakes.png', 17, 17);
            this.load.spritesheet('snowflakes_large', 'assets/sprites/snowflakes_large.png', 64, 64);
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        ParticleWeatherSample.prototype.create = function () {
            this.add.image(0, 0, 'sky');
            this.createRain();
            // this.makeButton('rain', 420, 40, () => {
            //     if (this.rainEmitter.alive) {
            //         this.rainEmitter.kill();
            //     }
            //     else {
            //         this.rainEmitter.revive();
            //     }
            // });
            // this.makeButton('snow', 420, 80, () => {
            // });
            // this.makeButton('fog', 420, 120, () => {
            //     this.addFog();
            // });
        };
        ParticleWeatherSample.prototype.createRain = function () {
            this.rainEmitter = this.add.emitter(this.world.centerX, 0, 400);
            this.rainEmitter.width = this.world.width;
            this.rainEmitter.angle = 10;
            this.rainEmitter.makeParticles('rain');
            this.rainEmitter.minParticleScale = 0.1;
            this.rainEmitter.maxParticleScale = 0.5;
            this.rainEmitter.setYSpeed(300, 500);
            this.rainEmitter.setXSpeed(-5, 5);
            this.rainEmitter.minRotation = 0;
            this.rainEmitter.maxRotation = 0;
            this.rainEmitter.start(false, 1600, 5, 0);
        };
        ParticleWeatherSample.prototype.createSnow = function () {
            this.snowEmitter = this.add.emitter(this.world.centerX, 0, 400);
            this.snowEmitter.width = this.world.width;
            this.snowEmitter.angle = 10;
            this.snowEmitter.makeParticles('rain');
            this.snowEmitter.minParticleScale = 0.1;
            this.snowEmitter.maxParticleScale = 0.5;
            this.snowEmitter.setYSpeed(300, 500);
            this.snowEmitter.setXSpeed(-5, 5);
            this.snowEmitter.minRotation = 0;
            this.snowEmitter.maxRotation = 0;
            this.snowEmitter.start(false, 1600, 5, 0);
        };
        ParticleWeatherSample.prototype.addFog = function () {
            var fog = this.game.add.bitmapData(this.game.width, this.game.height);
            fog.ctx.rect(0, 0, this.game.width, this.game.height);
            fog.ctx.fillStyle = '#b2ddc8';
            fog.ctx.fill();
            this.fogSprite = this.game.add.sprite(0, 0, fog);
            this.fogSprite.alpha = 0;
            this.game.add.tween(this.fogSprite).to({ alpha: 0.7 }, 6000, null, true);
        };
        ParticleWeatherSample.prototype.removeFog = function () {
            var _this = this;
            var fogTween = this.game.add.tween(this.fogSprite).to({ alpha: 0 }, 6000, null, true);
            fogTween.onComplete.add(function () {
                _this.fogSprite.kill();
            }, this);
        };
        // 테스트를 위한 버튼 생성
        ParticleWeatherSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return ParticleWeatherSample;
    }(Phaser.State));
    FeatureSample.ParticleWeatherSample = ParticleWeatherSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var PhysicsArcadeSample = /** @class */ (function (_super) {
        __extends(PhysicsArcadeSample, _super);
        function PhysicsArcadeSample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.facing = 'left';
            _this.jumpTimer = 0;
            return _this;
        }
        PhysicsArcadeSample.prototype.preload = function () {
            this.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);
            this.load.spritesheet('dude', 'assets/sprites/dude.png', 32, 48);
            this.load.image('background', 'assets/sprites/background2.png');
        };
        PhysicsArcadeSample.prototype.create = function () {
            this.time.desiredFps = 30;
            this.add.tileSprite(0, 0, 800, 600, 'background');
            // Arcade Physics 시작
            this.physics.startSystem(Phaser.Physics.ARCADE);
            // Arcade 설정
            this.physics.arcade.gravity.y = 100; // 중력 y값 적용
            // player 오브젝트 생성
            this.player = this.add.sprite(400, 300, 'dude');
            this.player.animations.add('left', [0, 1, 2, 3], 10, true);
            this.player.animations.add('turn', [4], 20, true);
            this.player.animations.add('right', [5, 6, 7, 8], 10, true);
            // player 오브젝트에 Arcade Physics 적용
            this.physics.enable(this.player, Phaser.Physics.ARCADE);
            // player 오브젝트의 Body를 가져와서 필요한 기능 설정
            var playerBody = this.player.body;
            playerBody.collideWorldBounds = true; // 월드를 벗어나지 못하도록 설정
            playerBody.bounce.y = 0.2; // Bounce
            playerBody.maxVelocity.y = 500; //
            playerBody.setSize(20, 32, 5, 16); // Body 사이즈 지정
            // veggies 그룹을 생성하고 Body를 적용합니다.
            this.veggies = this.add.group();
            this.veggies.enableBody = true;
            for (var i = 0; i < 20; i++) {
                // 10개는 1~16 프레임 사이의 야채 이미지를, 남은 10개는 칠리 이미지를 보여주도록 프레임을 변경합니다. 
                var s = this.veggies.create(this.rnd.integerInRange(100, 700), this.rnd.integerInRange(32, 200), 'veggies', (i < 10 ? this.rnd.between(1, 16) : 17));
                // 야채 오브젝트에 물리를 적용합니다.
                this.physics.enable(s, Phaser.Physics.ARCADE);
                s.body.velocity.x = this.rnd.integerInRange(-200, 200);
                s.body.velocity.y = this.rnd.integerInRange(-200, 200);
                s.body.collideWorldBounds = true;
                s.body.bounce.set(1);
            }
            // 입력 키 처리
            this.cursors = this.input.keyboard.createCursorKeys();
            this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };
        PhysicsArcadeSample.prototype.update = function () {
            // player와 veggies 그룹 사이에 충돌 처리를 합니다. 충돌하면 collisionHandler()가 호출됩니다.
            if (this.physics.arcade.collide(this.player, this.veggies, this.collisionHandler, this.processHandler, this)) {
                console.log('boom');
            }
            var playerBody = this.player.body;
            playerBody.velocity.x = 0;
            // player 오브젝트 이동 처리
            if (this.cursors.left.isDown) {
                playerBody.velocity.x = -150;
                if (this.facing != 'left') {
                    this.player.animations.play('left');
                    this.facing = 'left';
                }
            }
            else if (this.cursors.right.isDown) {
                playerBody.velocity.x = 150;
                if (this.facing != 'right') {
                    this.player.animations.play('right');
                    this.facing = 'right';
                }
            }
            else {
                if (this.facing != 'idle') {
                    this.player.animations.stop();
                    if (this.facing == 'left') {
                        this.player.frame = 0;
                    }
                    else {
                        this.player.frame = 5;
                    }
                    this.facing = 'idle';
                }
            }
            // player 오브젝트 점프 처리
            if (this.jumpButton.isDown && playerBody.onFloor() && this.time.now > this.jumpTimer) {
                playerBody.velocity.y = -250;
                this.jumpTimer = this.time.now + 750;
            }
        };
        PhysicsArcadeSample.prototype.processHandler = function (player, veg) {
            return true;
        };
        PhysicsArcadeSample.prototype.collisionHandler = function (player, veg) {
            if (veg.frame == 17) {
                veg.kill();
            }
        };
        PhysicsArcadeSample.prototype.render = function () {
            this.game.debug.text('방향키: 이동 / 점프: SpaceBar', 32, 32);
            this.game.debug.text('칠리를 먹으세요.', 32, 60);
            this.game.debug.body(this.player);
        };
        return PhysicsArcadeSample;
    }(Phaser.State));
    FeatureSample.PhysicsArcadeSample = PhysicsArcadeSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var PhysicsNinjaSample = /** @class */ (function (_super) {
        __extends(PhysicsNinjaSample, _super);
        function PhysicsNinjaSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PhysicsNinjaSample.prototype.preload = function () {
            this.load.image('block', 'assets/sprites/block.png');
            this.load.spritesheet('ninja-tiles', 'assets/tiles/ninja-tiles128.png', 128, 128, 34);
        };
        PhysicsNinjaSample.prototype.create = function () {
            // Ninja Physics 시작
            this.physics.startSystem(Phaser.Physics.NINJA);
            // block 오브젝트 생성
            this.block = this.add.sprite(100, 300, 'block');
            this.block.name = 'blockA';
            // block 오브젝트 Body를 AABB로 지정
            var bodyType = 1; // 1=AABB, 2=Circle, 3=Tile
            this.physics.ninja.enable(this.block, bodyType); // == enableAABB(this.block);
            // tile 오브젝트 생성
            this.tile = this.add.sprite(350, 300, 'ninja-tiles', 3);
            // block 오브젝트 Body를 Tile로 지정
            this.physics.ninja.enableTile(this.tile, this.tile.frame);
            // 입력 키 처리
            this.cursors = this.input.keyboard.createCursorKeys();
        };
        PhysicsNinjaSample.prototype.update = function () {
            // 충돌 처리
            this.physics.ninja.collide(this.block, this.tile);
            // 이동
            if (this.cursors.left.isDown) {
                this.block.body.moveLeft(20);
            }
            else if (this.cursors.right.isDown) {
                this.block.body.moveRight(20);
            }
            if (this.cursors.up.isDown) {
                this.block.body.moveUp(30);
            }
        };
        return PhysicsNinjaSample;
    }(Phaser.State));
    FeatureSample.PhysicsNinjaSample = PhysicsNinjaSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var PhysicsP2Sample = /** @class */ (function (_super) {
        __extends(PhysicsP2Sample, _super);
        function PhysicsP2Sample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.debug = true;
            _this.drawLine = false;
            return _this;
        }
        PhysicsP2Sample.prototype.preload = function () {
            this.load.image('bunny', 'assets/sprites/bunny.png');
            this.load.image('ball', 'assets/sprites/shinyball.png');
            this.load.image('cursor', 'assets/sprites/aqua_ball.png');
            this.load.physics('physicsData', 'assets/physics/sprites.json');
        };
        PhysicsP2Sample.prototype.create = function () {
            var bounds = new Phaser.Rectangle(100, 50, 600, 400);
            // P2 Physics 시작
            this.physics.startSystem(Phaser.Physics.P2JS);
            // P2 월드 설정
            this.physics.p2.restitution = 0.8;
            // P2 Physics를 적용한 Group을 만들고 20개의 오브젝트를 생성합니다.
            var balls = this.add.physicsGroup(Phaser.Physics.P2JS);
            for (var i = 0; i < 15; i++) {
                var ball = balls.create(bounds.randomX, bounds.randomY, 'ball');
                // Ball 오브젝트의 Body의 모양을 지정합니다.
                ball.body.setCircle(16);
            }
            // player 오브젝트 생성
            this.player = this.add.sprite(bounds.centerX, bounds.centerY, 'bunny');
            this.player.scale.set(0.5);
            // player 오브젝트에 P2 Physics 적용
            this.physics.p2.enable(this.player, this.debug);
            // player 오브젝트의 Body를 가져와서 필요한 기능 설정
            var playerBody = this.player.body;
            playerBody.gravity.y = 100;
            // 충돌 영역 설정
            playerBody.clearShapes(); // 현재 지정된 Body 영역 제거 (Sprite 오브젝트이므로 기본 Rectangle로 적용된 것을 제거)
            playerBody.loadPolygon('physicsData', 'bunny', this.player.scale.x); // 로드한 physicsData에서 폴리곤 데이터를 가져와서 적용
            // 마우스 입력 상황을 표시할 오브젝트 생성
            this.mouseBody = this.add.sprite(100, 100, 'cursor');
            this.physics.p2.enable(this.mouseBody, true);
            this.mouseBody.body.static = true;
            this.mouseBody.body.setCircle(10);
            this.mouseBody.body.data.shapes[0].sensor = true;
            this.line = new Phaser.Line(this.player.x, this.player.y, this.mouseBody.x, this.mouseBody.y);
            // 마우스 입력 처리
            this.input.onDown.add(this.click, this);
            this.input.onUp.add(this.release, this);
            this.input.addMoveCallback(this.move, this);
        };
        PhysicsP2Sample.prototype.click = function (pointer) {
            var bodies = this.physics.p2.hitTest(pointer.position, [this.player.body]);
            if (bodies.length) {
                // 마우스 스프링 생성
                this.mouseSpring = this.physics.p2.createSpring(this.mouseBody, bodies[0], 0, 30, 1);
                this.line.setTo(this.player.x, this.player.y, this.mouseBody.x, this.mouseBody.y);
                this.drawLine = true;
            }
        };
        PhysicsP2Sample.prototype.release = function () {
            // 마우스 스프링 제거
            this.game.physics.p2.removeSpring(this.mouseSpring);
            this.drawLine = false;
        };
        PhysicsP2Sample.prototype.move = function (pointer, x, y, isDown) {
            this.mouseBody.body.x = x;
            this.mouseBody.body.y = y;
            this.line.setTo(this.player.x, this.player.y, this.mouseBody.x, this.mouseBody.y);
        };
        PhysicsP2Sample.prototype.render = function () {
            if (this.drawLine) {
                this.game.debug.geom(this.line);
            }
        };
        return PhysicsP2Sample;
    }(Phaser.State));
    FeatureSample.PhysicsP2Sample = PhysicsP2Sample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var SpriteAnchorSample = /** @class */ (function (_super) {
        __extends(SpriteAnchorSample, _super);
        function SpriteAnchorSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpriteAnchorSample.prototype.preload = function () {
            this.load.image('pic', 'assets/sprites/lance-overdose-loader_eye.png');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        SpriteAnchorSample.prototype.create = function () {
            var _this = this;
            this.point = new Phaser.Point(150, 200);
            this.sprite = this.add.sprite(this.point.x, this.point.y, 'pic');
            // 설정된 Anchor의 값으로 설정합니다.
            this.makeButton('anchor (0, 0)', 420, 40, function () {
                _this.sprite.anchor.set(0);
            });
            this.makeButton('anchor (0.5, 0.5)', 420, 80, function () {
                _this.sprite.anchor.set(0.5);
            });
            this.makeButton('anchor (1, 1)', 420, 120, function () {
                _this.sprite.anchor.set(1);
            });
            this.makeButton('anchor (1, 0)', 420, 240, function () {
                _this.sprite.anchor.set(1, 0);
            });
            this.makeButton('anchor (0.5, 0)', 420, 280, function () {
                _this.sprite.anchor.set(0.5, 0);
            });
            this.makeButton('anchor (0, 1)', 420, 160, function () {
                _this.sprite.anchor.set(0, 1);
            });
            this.makeButton('anchor (0, 0.5)', 420, 200, function () {
                _this.sprite.anchor.set(0, 0.5);
            });
        };
        SpriteAnchorSample.prototype.render = function () {
            this.game.debug.geom(this.point, 'rgb(0, 255, 0)');
            this.game.debug.text('Anchor X: ' + this.sprite.anchor.x.toFixed(1) + ' Y: ' + this.sprite.anchor.y.toFixed(1), 32, 32);
            this.game.debug.text('Sprite X: ' + this.sprite.x + ' Y: ' + this.sprite.y, 32, 64);
        };
        // 테스트를 위한 버튼 생성
        SpriteAnchorSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return SpriteAnchorSample;
    }(Phaser.State));
    FeatureSample.SpriteAnchorSample = SpriteAnchorSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var SpriteEffectSample = /** @class */ (function (_super) {
        __extends(SpriteEffectSample, _super);
        function SpriteEffectSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpriteEffectSample.prototype.preload = function () {
            this.load.image('pic', 'assets/sprites/trsipic1_lazur.jpg');
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        SpriteEffectSample.prototype.create = function () {
            var _this = this;
            this.sprite = this.add.sprite(0, 0, 'pic');
            // Crop 영역 설정
            this.cropRect = new Phaser.Rectangle(0, 0, 128, 128);
            // Mask로 사용할 Graphic 데이터 생성
            this.mask = this.add.graphics(0, 0);
            this.mask.beginFill(0xffffff);
            this.mask.drawCircle(100, 100, 100);
            this.input.addMoveCallback(this.move, this);
            this.makeButton('crop', 420, 100, function () {
                if (_this.sprite.cropRect) {
                    // Crop 초기화
                    _this.sprite.crop(null, false);
                }
                else {
                    // 선택된 영역으로 Crop 실행
                    _this.sprite.crop(_this.cropRect, false);
                    // 1.5초마다 Crop 영역 업데이트
                    _this.time.events.repeat(Phaser.Timer.SECOND * 1.5, 100, function () {
                        if (_this.sprite.cropRect) {
                            _this.cropRect.x = Math.min(_this.world.randomX, 510);
                            _this.cropRect.y = Math.min(_this.world.randomY, 320);
                            _this.sprite.updateCrop();
                        }
                    });
                }
            });
            this.makeButton('mask', 420, 140, function () {
                // Mask 활성/비활성
                _this.sprite.mask = (_this.sprite.mask) ? null : _this.mask;
            });
            this.makeButton('tint', 420, 180, function () {
                // Tint 색상 랜덤 변경
                _this.sprite.tint = Math.random() * 0xffffff;
            });
        };
        SpriteEffectSample.prototype.move = function (pointer, x, y) {
            this.mask.x = x - 100;
            this.mask.y = y - 100;
        };
        SpriteEffectSample.prototype.render = function () {
            this.game.debug.text('Crop: ' + (this.sprite.cropRect != null) + ',  Mask: ' + (this.sprite.mask != null), 32, 32);
        };
        // 테스트를 위한 버튼 생성
        SpriteEffectSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return SpriteEffectSample;
    }(Phaser.State));
    FeatureSample.SpriteEffectSample = SpriteEffectSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var BitmapTextSample = /** @class */ (function (_super) {
        __extends(BitmapTextSample, _super);
        function BitmapTextSample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.textData = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quid ergo aliud intellegetur nisi uti ne quae pars naturae neglegatur? Si longus, levis; Ita relinquet duas, de quibus etiam atque etiam consideret. Optime, inquam. Sed quanta sit alias, nunc tantum possitne esse tanta.\n\nQuid, si etiam iucunda memoria est praeteritorum malorum? Consequatur summas voluptates non modo parvo, sed per me nihilo, si potest; Atque his de rebus et splendida est eorum et illustris oratio. Mihi enim satis est, ipsis non satis. Ergo ita: non posse honeste vivi, nisi honeste vivatur? Mihi quidem Antiochum, quem audis, satis belle videris attendere. Et quod est munus, quod opus sapientiae? Ex rebus enim timiditas, non ex vocabulis nascitur. Ex ea difficultate illae fallaciloquae, ut ait Accius, malitiae natae sunt. Nonne videmus quanta perturbatio rerum omnium consequatur, quanta confusio? Quae cum magnifice primo dici viderentur, considerata minus probabantur.\n\n---> Click to remove text";
            return _this;
        }
        BitmapTextSample.prototype.preload = function () {
            this.load.bitmapFont('gem', 'assets/fonts/bitmapFonts/gem.png', 'assets/fonts/bitmapFonts/gem.xml');
        };
        BitmapTextSample.prototype.create = function () {
            this.stage.backgroundColor = 0x272822;
            this.bitmapText = this.add.bitmapText(32, 32, 'gem', this.textData, 16);
            // 가로 폭 조정
            this.bitmapText.maxWidth = 450;
            // 화면 터치 시 chopText() 호출
            this.input.onDown.addOnce(this.chopText, this);
        };
        BitmapTextSample.prototype.chopText = function () {
            this.bitmapText.text = this.textData.substr(0, 26);
            // purgeGlyphs - 출력된 문자의 개수가 많았다가 줄어든 경우 BitmapText._glyphs 배열에는 많은 양의 Sprite가 유지됩니다.
            // 화면에서는 보이지 않지만 나중에 다시 사용하기 위해 기다리는 글리프 풀에 있는 동안 메모리를 차지합니다.
            // 더 늘어나지 않는다면 메서드를 호출하여 초과된 글리프를 제거하고 얼만큼 제거했는지 결과로 돌려줍니다.
            var purged = this.bitmapText.purgeGlyphs();
            this.add.bitmapText(32, 128, 'gem', "Purged " + purged + " glyphs", 32);
        };
        return BitmapTextSample;
    }(Phaser.State));
    FeatureSample.BitmapTextSample = BitmapTextSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var TextEffectSample = /** @class */ (function (_super) {
        __extends(TextEffectSample, _super);
        function TextEffectSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextEffectSample.prototype.preload = function () {
            this.load.spritesheet('button', 'assets/sprites/flixel-button.png', 80, 20);
        };
        TextEffectSample.prototype.create = function () {
            var _this = this;
            this.stage.backgroundColor = 0x3b0760;
            this.textStyle = {
                font: "35px Arial",
                fill: "#ffffff",
                align: "center"
            };
            // 별도의 스타일을 지정하지 않으면 
            this.text = this.add.text(150, 100, "Phaser Text 샘플!", this.textStyle);
            this.text.anchor.set(0.5);
            // Color
            this.makeButton('color', 420, 60, function () {
                _this.text.fill = Phaser.Color.getWebRGB(Phaser.Color.getRandomColor());
                // 뒤에서 세글자 강제로 색상 지정
                _this.text.addColor(Phaser.Color.getWebRGB(Phaser.Color.getRandomColor()), 11);
            });
            // Tint - Color값과 별도로 기존 Color에 추가 색상을 얹는 느낌입니다.
            this.makeButton('tint', 420, 100, function () {
                _this.text.tint = Math.random() * 0xffffff;
            });
            // Shadow
            this.makeButton('shadow', 420, 140, function () {
                _this.text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
            });
            // Stroke
            this.makeButton('stroke', 420, 180, function () {
                _this.text.stroke = Phaser.Color.getWebRGB(Phaser.Color.getRandomColor());
                _this.text.strokeThickness = 3;
            });
            // Gradient
            this.makeButton('gradient', 420, 220, function () {
                var gradient = _this.text.context.createLinearGradient(0, 0, 0, _this.text.height);
                gradient.addColorStop(0, Phaser.Color.getWebRGB(Phaser.Color.getRandomColor()));
                gradient.addColorStop(1, Phaser.Color.getWebRGB(Phaser.Color.getRandomColor()));
                _this.text.fill = gradient;
            });
            // Reflect - 별도의 기능은 아니고 Text를 두번 출력
            this.makeButton('reflect', 420, 260, function () {
                if (_this.reflectionText) {
                    if (!_this.reflectionText.visible) {
                        _this.reflectionText.visible = true;
                    }
                }
                else {
                    _this.reflectionText = _this.add.text(_this.text.x, _this.text.y + 50, _this.text.text, _this.textStyle);
                    _this.reflectionText.anchor.set(0.5);
                    _this.reflectionText.scale.y = -1;
                    var gradient = _this.reflectionText.context.createLinearGradient(0, 0, 0, _this.text.canvas.height);
                    gradient.addColorStop(0, 'rgba(255,255,255,0)');
                    gradient.addColorStop(1, 'rgba(255,255,255,0.08)');
                    _this.reflectionText.fill = gradient;
                }
            });
            // Clear - 랜덤으로 틴트 적용
            this.makeButton('clear', 420, 320, function () {
                _this.text.tint = 0xFFFFFF;
                _this.text.fill = 'white';
                _this.text.stroke = null;
                _this.text.setShadow(0, 0, null);
                if (_this.reflectionText && _this.reflectionText.visible) {
                    _this.reflectionText.visible = false;
                }
            });
        };
        // 테스트를 위한 버튼 생성
        TextEffectSample.prototype.makeButton = function (name, x, y, callback) {
            var button = this.add.button(x, y, 'button', callback, this, 0, 1, 2);
            button.name = name;
            button.scale.set(2, 1.5);
            button.smoothed = false;
            var label = this.add.text(x, y + 7, name, { fontSize: 12 });
            label.x += (button.width / 2) - (label.width / 2);
        };
        return TextEffectSample;
    }(Phaser.State));
    FeatureSample.TextEffectSample = TextEffectSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var TextWordSample = /** @class */ (function (_super) {
        __extends(TextWordSample, _super);
        function TextWordSample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.index = 0;
            _this.ipsum = "화면을 클릭하면 정렬 상태가 변경됩니다.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Quid ergo aliud intellegetur nisi uti ne quae pars naturae neglegatur?\n\nSi longus, levis; Ita relinquet duas, de quibus etiam atque etiam consideret. Optime, inquam. Sed quanta sit alias, nunc tantum possitne esse tanta.\n\nQuid, si etiam iucunda memoria est praeteritorum malorum?";
            _this.align = [
                { h: 'left', v: 'top', a: 'left' },
                { h: 'center', v: 'top', a: 'center' },
                { h: 'right', v: 'top', a: 'right' },
                { h: 'left', v: 'middle', a: 'left' },
                { h: 'center', v: 'middle', a: 'center' },
                { h: 'right', v: 'middle', a: 'right' },
                { h: 'left', v: 'bottom', a: 'left' },
                { h: 'center', v: 'bottom', a: 'center' },
                { h: 'right', v: 'bottom', a: 'right' }
            ];
            return _this;
        }
        TextWordSample.prototype.create = function () {
            this.stage.backgroundColor = 0x3b0760;
            this.textStyle = {
                font: "12px Arial",
                fill: "#ffffff",
                align: "left",
                // Word Wrap을 지정합니다.
                wordWrap: true, wordWrapWidth: 300
            };
            this.text = this.add.text(0, 0, this.ipsum, this.textStyle);
            // 텍스트 영역을 지정합니다.
            this.text.setTextBounds(16, 16, 568, 368);
            // 줄 간격을 설정합니다.
            this.text.lineSpacing = -1;
            // 텍스트의 해상도를 변경합니다. 기본 값은 해상도에 맞춰서 설정되지만 별도로 지정할 수 있습니다.
            this.text.resolution = 2;
            // 화면 터치 시 
            this.input.onDown.add(this.changeAlign, this);
        };
        TextWordSample.prototype.changeAlign = function () {
            this.index++;
            if (this.index === this.align.length) {
                this.index = 0;
            }
            //  Un-comment this line to keep the text left-aligned
            this.text.align = this.align[this.index].a;
            this.text.boundsAlignH = this.align[this.index].h;
            this.text.boundsAlignV = this.align[this.index].v;
        };
        return TextWordSample;
    }(Phaser.State));
    FeatureSample.TextWordSample = TextWordSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var TextWordTabSample = /** @class */ (function (_super) {
        __extends(TextWordTabSample, _super);
        function TextWordTabSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextWordTabSample.prototype.create = function () {
            this.stage.backgroundColor = 0x3b0760;
            this.textStyle = {
                font: "12px Arial",
                fill: "#ffffff",
                align: "left",
            };
            var swords = [
                ['Knife', '1d3', '1', ''],
                ['Dagger', '1d4', '1', 'May be thrown'],
                ['Rapier', '1d6', '2', 'Max strength damage bonus +1'],
                ['Sabre', '1d6', '3', 'Max strength damage bonus +3'],
                ['Cutlass', '1d6', '5', ''],
                ['Scimitar', '2d4', '4', ''],
                ['Long Sword', '1d8+1', '6', ''],
                ['Bastard Sword', '1d10+1', '8', 'Requires 2 hands to use effectively'],
                ['Great Sword', '1d12+1', '10', 'Must always be used with 2 hands']
            ];
            this.text = this.add.text(32, 32, '', this.textStyle);
            // 탭 간격 지정
            this.text.tabs = [130, 100, 60];
            this.text.parseList(swords);
        };
        return TextWordTabSample;
    }(Phaser.State));
    FeatureSample.TextWordTabSample = TextWordTabSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var TweenArraySample = /** @class */ (function (_super) {
        __extends(TweenArraySample, _super);
        function TweenArraySample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.method = 0;
            return _this;
        }
        TweenArraySample.prototype.preload = function () {
            this.load.image('logo', 'assets/sprites/phaser2.png');
        };
        TweenArraySample.prototype.create = function () {
            this.logo = this.add.sprite(0, 0, 'logo');
            this.logo.scale.set(0.5);
            var style = { font: "26px Arial", fill: "#ff0044", align: "center" };
            this.text = this.add.text(this.world.centerX, this.world.centerY, "Linear Interpolation", style);
            this.text.anchor.set(0.5);
            var w = this.game.width - this.logo.width;
            var h = this.game.height - this.logo.height;
            // Tween을 사용합니다.
            this.tween = this.add.tween(this.logo).to({ x: [w, w, 0, 0], y: [0, h, h, 0] }, 4000, "Sine.easeInOut", true, 0, -1);
            // Tween이 반복될 때 changeInterplation()를 호출하도록 설정합니다.
            this.tween.onLoop.add(this.changeInterplation, this);
        };
        TweenArraySample.prototype.changeInterplation = function () {
            this.method++;
            console.log('loop ' + this.method);
            if (this.method === 1) {
                this.tween.interpolation(Phaser.Math.bezierInterpolation);
                this.text.text = "Bezier Interpolation";
            }
            else if (this.method === 2) {
                this.tween.interpolation(Phaser.Math.catmullRomInterpolation);
                this.text.text = "CatmullRom Interpolation";
            }
            else if (this.method === 3) {
                this.method = 0;
                this.tween.interpolation(Phaser.Math.linearInterpolation);
                this.text.text = "Linear Interpolation";
            }
        };
        return TweenArraySample;
    }(Phaser.State));
    FeatureSample.TweenArraySample = TweenArraySample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var TweenChainSample = /** @class */ (function (_super) {
        __extends(TweenChainSample, _super);
        function TweenChainSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TweenChainSample.prototype.preload = function () {
            this.load.image('logo', 'assets/sprites/phaser2.png');
        };
        TweenChainSample.prototype.create = function () {
            this.logo = this.add.sprite(0, 0, 'logo');
            this.logo.scale.set(0.5);
            // Tween을 호출하고 .to()를 이어서 호출하면 트윈이 이어서 진행됩니다.
            this.add.tween(this.logo)
                .to({ x: this.scale.width - this.logo.width }, 2000)
                .to({ y: this.scale.height - this.logo.height }, 2000)
                .to({ x: 0 }, 2000)
                .to({ y: 0 }, 2000).loop().start();
        };
        return TweenChainSample;
    }(Phaser.State));
    FeatureSample.TweenChainSample = TweenChainSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var TweenDataSample = /** @class */ (function (_super) {
        __extends(TweenDataSample, _super);
        function TweenDataSample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.index = 0;
            _this.pos = [];
            return _this;
        }
        TweenDataSample.prototype.preload = function () {
            this.load.image('obj', 'assets/sprites/phaser-dude.png');
        };
        TweenDataSample.prototype.create = function () {
            var tweenData = { x: 0, y: 0 };
            this.tween = this.add.tween(tweenData).to({ x: 100, y: 250 }, 2000, "Sine.easeInOut");
            this.tween.yoyo(true);
            // 초당 60프레임의 속도로 트윈 데이터를 생성합니다.
            // 이 기능은 서로 다른 좌표에서 동일한 트윈을 사용하는 객체가 많은 경우 유용합니다.
            // 모션과 관련된 모든 오브젝트의 프로퍼티 전반에 동일한 트윈을 계산하지 않아도 됩니다.
            // 대신 사전에 미리 계산하여 메모리에 저장하여 배열에 저장합니다.
            this.data = this.tween.generateData(60);
            this.bugs = this.add.group();
            this.pos.push(new Phaser.Point(32, 0));
            this.pos.push(new Phaser.Point(250, 100));
            this.pos.push(new Phaser.Point(450, 70));
            this.bugs.create(this.pos[0].x, this.pos[0].y, 'obj');
            this.bugs.create(this.pos[1].x, this.pos[1].y, 'obj');
            this.bugs.create(this.pos[2].x, this.pos[2].y, 'obj');
        };
        TweenDataSample.prototype.update = function () {
            // 간단한 데이터 재생
            // 배열의 각 요소는 트위닝 된 모든 속성을 포함하는 오브젝트를 포함합니다.
            // 이 경우에는 x, y 속성에 대해 트윈 데이터가 사전에 미리 생성되었습니다.
            // 직접 좌표에 더하여 업데이트를 진행합니다.
            var i = 0;
            var bug = this.bugs.getAt(i);
            bug.x = this.pos[i].x + this.data[this.index].x;
            bug.y = this.pos[i].y + this.data[this.index].y;
            i = 1;
            bug = this.bugs.getAt(i);
            bug.x = this.pos[i].x + (this.data[this.index].x / 2);
            bug.y = this.pos[i].y + this.data[this.index].y;
            i = 2;
            bug = this.bugs.getAt(i);
            bug.x = this.pos[i].x - this.data[this.index].x;
            bug.y = this.pos[i].y + this.data[this.index].y;
            this.index++;
            if (this.index === this.data.length) {
                this.index = 0;
            }
        };
        return TweenDataSample;
    }(Phaser.State));
    FeatureSample.TweenDataSample = TweenDataSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var TweenEventSample = /** @class */ (function (_super) {
        __extends(TweenEventSample, _super);
        function TweenEventSample() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.repeatCount = 5;
            return _this;
        }
        TweenEventSample.prototype.preload = function () {
            this.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);
        };
        TweenEventSample.prototype.create = function () {
            this.ball = this.add.sprite(this.world.centerX, 0, 'balls', 0);
            this.tween = this.game.add.tween(this.ball).to({ y: this.world.height - this.ball.height }, 1500, Phaser.Easing.Bounce.Out, false, 0, this.repeatCount);
            // 이벤트 함수를 연결합니다.
            this.tween.onStart.add(this.onStart, this);
            this.tween.onRepeat.add(this.onRepeat, this);
            this.tween.onComplete.add(this.onComplete, this);
            // 트윈을 시작합니다.
            this.tween.start();
        };
        TweenEventSample.prototype.onStart = function () {
            console.log('onStart');
        };
        TweenEventSample.prototype.onRepeat = function () {
            console.log('onRepeat');
            this.repeatCount--;
            // 트윈이 반복될 때마다 ball의 프레임을 변경합니다.
            this.ball.frame++;
        };
        TweenEventSample.prototype.onComplete = function () {
            console.log('onComplete');
            this.tween = this.add.tween(this.ball).to({ x: 800 - this.ball.width }, 2000, Phaser.Easing.Exponential.Out, true);
        };
        TweenEventSample.prototype.render = function () {
            this.game.debug.text('Bounces: ' + this.repeatCount, 32, 32);
        };
        return TweenEventSample;
    }(Phaser.State));
    FeatureSample.TweenEventSample = TweenEventSample;
})(FeatureSample || (FeatureSample = {}));
var FeatureSample;
(function (FeatureSample) {
    var TweenSample = /** @class */ (function (_super) {
        __extends(TweenSample, _super);
        function TweenSample() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TweenSample.prototype.preload = function () {
            this.load.image('space', 'assets/sprites/starfield.png');
            this.load.image('logo', 'assets/sprites/phaser2.png');
        };
        TweenSample.prototype.create = function () {
            this.add.tileSprite(0, 0, 800, 600, 'space');
            this.logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
            this.logo.anchor.set(0.5);
            this.logo.scale.set(0.5);
            this.logo.alpha = 0;
            // Tween을 사용합니다.
            this.tween = this.add.tween(this.logo).to({ alpha: 1 }, 4000, "Sine.easeInOut", true, 0, -1);
        };
        return TweenSample;
    }(Phaser.State));
    FeatureSample.TweenSample = TweenSample;
})(FeatureSample || (FeatureSample = {}));
//# sourceMappingURL=app.js.map