# Deb Node Service
This is a boilerplate for making installable node projects on Ubuntu/Debian.

## What does this do?

If deb package is installed with default configs, it will start a small HTTP server on `localhost` port `8080`.

You can test by opening your browser to link `http://localhost:8080/`, or by running the following command:

```
curl localhost:8080
```

You should get the text back:

```
Thank you for visiting.
```

## Useful links

- [GNU Make Docs](https://www.gnu.org/software/make/manual/make.html)
- [dpkg-deb Command Docs](https://man7.org/linux/man-pages/man1/dpkg-deb.1.html)
- [Debian Control File Docs](https://www.debian.org/doc/debian-policy/ch-controlfields.html#s-binarycontrolfiles)
- [SystemD Service Docs](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [What are preinst, postinst files](https://www.hivelocity.net/kb/what-are-preinst-postinst-prerm-and-postrm-script-2/)
- [Javascript Docs](https://devdocs.io/javascript/)
- [NodeJS HTTP Docs](https://nodejs.org/api/http.html)

## Dependencies

- nodejs (>= 12.22.0)
- npm (>= 8.5.0)

## Make scripts

`make build` - Converts contents of the `src/` directory into an installable `.deb` package.
`make clean` - Removes previously created `.deb` file
`make install` - Installs a previously created `.deb` file (requires root)
`make uninstall` - Uninstalls a previously installed `.deb` file (requires root)
`make all` - Cleans any existing `.deb` file and creates a new one.
