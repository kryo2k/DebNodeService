src_dir = src
control_file = ./${src_dir}/DEBIAN/control
package_name = $(shell grep Package ${control_file} | awk -F' ' '{print $$2}')
package_version = $(shell grep Version ${control_file} | awk -F' ' '{print $$2}')
architecture = $(shell grep Architecture ${control_file} | awk -F' ' '{print $$2}')
deb_file = ${package_name}-$(architecture)-${package_version}.deb

all : clean build

build :
	dpkg-deb --build ${src_dir} ${deb_file}

rootcheck :
ifneq ($(shell id -u), 0)
	@echo "You are not root, run this target as root please"
	exit 1
endif

install : rootcheck build
	dpkg -i ${deb_file}

uninstall : rootcheck build
	dpkg -r ${package_name}

clean :
ifneq (,$(wildcard ${deb_file}))
	rm ${deb_file}
endif
