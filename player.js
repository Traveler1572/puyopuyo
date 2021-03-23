class Player {
    // static centerPuyo;
    // static movablePuyo;
    // static puyoStatus;
    // static centerPuyoElement;
    // static movablePuyoElement;

    // static groundFrame;
    // static keyStatus;

    // static actionStartFrame;
    // static moveSource;
    // static moveDestination;
    // static rotateBeforeLeft;
    // static rotateAfterLeft;
    // static rotateFromRotation;

    static initialize(){
        // キーボードの入力を確認する
        this.keyStatus = {
            right: false,
            left: false,
            up: false,
            down: false
        };
        // ブラウザのキーボードの入力を取得するイベントリスナを登録する
        document.addEventListener('keydown', (e) => {
            // キーボードが押された場合
            switch (e.keyCode) {
                case 37:    // 左向きキー
                    this.keyStatus.left = true;
                    e.preventDefault(); return false;
                case 38:    // 上向きキー
                    this.keyStatus.up = true;
                    e.preventDefault(); return false;
                case 39:    // 右向きキー
                    this.keyStatus.right = true;
                    e.preventDefault(); return false;
                case 40:    // 下向きキー
                    this.keyStatus.down = true;
                    e.preventDefault(); return false;
            }
        });
        document.addEventListener('keyup', (e) => {
            // キーボードが離された場合
            switch (e.keyCode) {
                case 37:    // 左向きキー
                    this.keyStatus.left = false;
                    e.preventDefault(); return false;
                case 38:    // 上向きキー
                    this.keyStatus.up = false;
                    e.preventDefault(); return false;
                case 39:    // 右向きキー
                    this.keyStatus.right = false;
                    e.preventDefault(); return false;
                case 40:    // 下向きキー
                    this.keyStatus.down = false;
                    e.preventDefault(); return false;
            }
        });
        // タッチ操作追加
        this.touchPoint = {
            xs: 0,
            ys: 0,
            xe: 0,
            ye: 0
        }
        document.addEventListener('touchstart', (e) => {
            this.touchPoint.xs = e.touches[0].clientX
            this.touchPoint.ys = e.touches[0].clientY
        })
        document.addEventListener('touchmove', (e) => {
            // 指が少し動いた時は無視
            if (Math.abs(e.touches[0].clientX - this.touchPoint.xs) < 20 &&
                Math.abs(e.touches[0].clientY - this.touchPoint.ys) < 20
            ) {
                return
            }
        
            // 指の動きをからジェスチャーによるKeyStatusプロパティを更新
            this.touchPoint.xe = e.touches[0].clientX
            this.touchPoint.ye = e.touches[0].clientY
            const {xs, ys, xe, ye} = this.touchPoint
            gesture(xs, ys, xe, ye)


            this.touchPoint.xs = this.touchPoint.xe
            this.touchPoint.ys = this.touchPoint.ye
        })
        document.addEventListener('touchend', (e) => {
            this.keyStatus.up = false
            this.keyStatus.down = false
            this.keyStatus.left = false
            this.keyStatus.right = false
        })

        // ジェスチャーを判定して、keyStatusプロパティを更新する関数
        const gesture = (xs, ys, xe, ye) => {
            const horizonDirection = xe - xs;
            const verticalDirection = ye - ys;
        
            if (Math.abs(horizonDirection) < Math.abs(verticalDirection)) {
                // 縦方向
                if (verticalDirection < 0) {
                    // up
                    this.keyStatus.up = true
                    this.keyStatus.down = false
                    this.keyStatus.left = false
                    this.keyStatus.right = false
                } else if (0 <= verticalDirection) {
                    // down
                    this.keyStatus.up = false
                    this.keyStatus.down = true
                    this.keyStatus.left = false
                    this.keyStatus.right = false
                }
            } else {
                // 横方向
                if (horizonDirection < 0) {
                    // left
                    this.keyStatus.up = false
                    this.keyStatus.down = false
                    this.keyStatus.left = true
                    this.keyStatus.right = false
                } else if (0 <= horizonDirection) {
                    // right
                    this.keyStatus.up = false
                    this.keyStatus.down = false
                    this.keyStatus.left = false
                    this.keyStatus.right = true
                }
            }
        }
    }
    // ぷよ設置確認
    static createNewPuyo () {
        // ぷよぷよが置けるかどうか、1番上の段の左から3つ目を確認する
        if(Stage.board[0][2]) {
            // 空白でない場合は新しいぷよを置けない
            return false;
        }
        // 新しいぷよの色を決める
        const puyoColors = Math.max(1, Math.min(5, Config.puyoColors));
        this.centerPuyo = Math.floor(Math.random() * puyoColors) + 1;
        this.movablePuyo = Math.floor(Math.random() * puyoColors) + 1;
        // 新しいぷよ画像を作成する
        this.centerPuyoElement = PuyoImage.getPuyo(this.centerPuyo);
        this.movablePuyoElement = PuyoImage.getPuyo(this.movablePuyo);
        Stage.stageElement.appendChild(this.centerPuyoElement);
        Stage.stageElement.appendChild(this.movablePuyoElement);
        // ぷよの初期配置を定める
        this.puyoStatus = {
            x: 2,   // 中心ぷよの位置：左から2列目
            y: -1   // 画面上部ギリギリから出てくる
            left: 2 * Config.puyoImgWidth,
            top: -1 * Config.puyoImgHeight,
            dx: 0,  // 動くぷよの相対位置
            dy: -1,
            rotation: 90    // 動くぷよの角度は90度（上向き）
        };
        // 接地時間はゼロ
        this.groundFrame = 0;
        // ぷよを描画
        this.setPuyoPosition();
        return true;
    }

    static setPuyoPosition () {
        this.centerPuyoElement.style.left = this.puyoStatus.left + 'px';
        this.centerPuyoElement.style.top = this.puyoStatus.top + 'px';
        const x = this.puyoStatus.left + Math.cos(this.puyoStatus.rotation * Math.PI / 180) * Config.puyoImgWidth;
        const y = this.puyoStatus.top + Math.sin(this.puyoStatus.rotation * Math.PI / 180) * Config.puyoImgHeight;
        this.movablePuyoElement.style.left = x + 'px';
        this.movablePuyoElement.style.top = y + 'px';
    }
}