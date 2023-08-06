const loadingPage = function() {
    const progressBarContainer = document.createElement("div");
    progressBarContainer.className = 'progress-bar-container';

    Object.assign(progressBarContainer.style, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        // backgroundColor: "rgba(0, 0, 0, 0.8)",
        backgroundColor: "black",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    });

    const title = document.createElement('label');
    title.id = 'loading-content';
    Object.assign(title.style, {
        color: 'rgba(256, 256, 256, 0.8)',
        fontSize: "x-large"
    });

    const progress = document.createElement('progress');
    progress.id = 'progress-bar';
    progress.value = 0;
    progress.max = 100;

    Object.assign(progress.style, {
        width: '30%',
        marginTop: '0.5%',
        height: '2%'
    });

    progressBarContainer.appendChild(title);
    progressBarContainer.appendChild(progress);
    PARENT_VIEW.appendChild(progressBarContainer);

}

const loadingBar = function(manager, transparent = false) {
    const progressBar = document.getElementById('progress-bar');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    progressBarContainer.style.display = 'flex';
    progressBarContainer.style.backgroundColor = transparent ? 'transparent' : 'black';

    const title = document.getElementById('loading-content');
    let message = "";
    title.innerHTML = message;

    manager.onProgress = function(url, loaded, total) {
        let loadProgress = loaded/total * 100;
        if(loadProgress < 90) {
            message = "Welcome to Scientific Meta Park. This will require few minutes to download.";
        } else if(loadProgress < 95) {
            message =  "Press W | A | S | D to move. SHIFT to run. SPACE to jump.";
        } else if(loadProgress < 100) {
            message =  "Almost done. Please wait...";
        }
        title.innerHTML = transparent ? "" : message;

        progressBar.value = loadProgress;
    }

    manager.onLoad = function() {
        progressBarContainer.style.display = 'none';
    }
}

export {loadingPage, loadingBar};
