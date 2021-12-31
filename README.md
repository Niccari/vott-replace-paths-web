# vott-replace-paths-web
Allows VoTT project files to be loaded after they have been moved. Supports both local file systems and the Azure Blob Storage.

Refer [vott-replace-paths](https://github.com/Niccari/vott-replace-paths) for a python implement.

## Usage
Compress VoTT project as a zip file. Its file structure should be as follows.

```
your_input_vott_project.zip
- *.vott
- *(asset1_ID)-asset.json
- *(asset2_ID)-asset.json
...
- *(assetN_ID)-asset.json
```

Follow the instructions on the web page, specify

- Source connection after moving files
- Target connection after moving files
- Security token
- Zip file

and convert it. The conversion result will be downloaded automatically.

Note that the files and conversions are processed only within the browser, and are not saved on the server.

## Acknowledgements
This code is based on the [update-vott-assets](https://github.com/cnrmck/update-vott-assets), Thanks!

