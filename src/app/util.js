function handleFileChange(e, component) {
  const files = e.target.files;
  if (files.length == 1) {
    const file = files[0],
      reader = new FileReader();
    reader.onload = e => {
      component.setState({ data: e.target.result });
    };
    reader.readAsText(file);
  }
  document.body.click();
}

function handleTextUpdate(component) {
  $("#modal").modal("hide");
  component.setState({
    data: document.getElementById("input_textarea").value
  });
}

export { handleFileChange, handleTextUpdate };
