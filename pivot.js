ui.setTitle("pivot");

var assetsPath = ui.scriptLocation + "/pivot_assets/";

var pivotLabel = new ui.Label("Move bounding box pivot");

buttonVLayout = new ui.VLayout();
buttonVLayout.setSpaceBetween(0);
buttonVLayout.setMargins(0, 0, 0, 0);

hLayouts = [];

for (let i = 0; i < 3; i++) {
  hLayouts[i] = new ui.HLayout();
  hLayouts[i].setSpaceBetween(0);
  hLayouts[i].setMargins(0, 0, 0, 0);
  buttonVLayout.add(hLayouts[i]);
}

var pivots = [
  [0, 0],
  [0.5, 0],
  [1, 0],
  [0, 0.5],
  [0.5, 0.5],
  [1, 0.5],
  [0, 1],
  [0.5, 1],
  [1, 1],
];

pivotButtons = [];

for (let i = 0; i < pivots.length; i++) {
  pivotButtons[i] = new ui.ImageButton(assetsPath + i + ".png");
  pivotButtons[i].setImageSize(32, 32);
  pivotButtons[i].onClick = function () {
    SetPivot(pivots[i]);
  };
  hLayouts[Math.floor(i / 3)].add(pivotButtons[i]);
}

/**
 * Moves the pivot of the selected layer
 * @param {number[]} pivotMultiplier The x and y proportions of the pivot (e.g [0.5, 1] for the bottom centre)
 */
function SetPivot(pivotMultiplier) {
  var sel = api.getSelection();

  if (sel.length != 1) {
    console.warn("Cannot change pivot: Select only one layer");
  } else {
    var bbox = api.getBoundingBox(sel[0], true);
    var position = api.get(sel[0], "position");
    var pivot = api.get(sel[0], "pivot");
    var scale = api.get(sel[0], "scale");
    // var skew = api.get(sel[0], "skew");

    var newSimplePivX = bbox.left + pivotMultiplier[0] * bbox.width;
    var newSimplePivY = bbox.top - pivotMultiplier[1] * bbox.height;

    // var skewedPivX = newSimplePivX - (newSimplePivY * skew.x);
    // var skewedPivY = newSimplePivY - (newSimplePivX * skew.y);

    var XChange = position.x - newSimplePivX;
    var YChange = position.y - newSimplePivY;

    var newPosX = position.x - XChange;
    var newPosY = position.y - YChange;
    var newPivotX = pivot.x - XChange / scale.x;
    var newPivotY = pivot.y - YChange / scale.y;

    api.set(sel[0], {
      "position.x": newPosX,
      "position.y": newPosY,
      "pivot.x": newPivotX,
      "pivot.y": newPivotY,
    });
  }
}

const container = new ui.Container();
container.setSize(72, 72);
container.setLayout(buttonVLayout);
ui.add(container);
ui.show();
