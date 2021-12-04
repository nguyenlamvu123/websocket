##ubuntu: sudo apt-get install patchelf
##py cx_________Freeze.py build
import os;import shutil

if os.path.isdir('websooocket'):
    shutil.rmtree('websooocket')
    
from cx_Freeze import setup, Executable
import sys

buildOptions = dict(packages = [],
                    excludes = [],
                    include_files = [],
                    )

base = None
##base = 'Win32GUI' if sys.platform=='win32' else None
executables = [
    Executable('echo-client.py', base=base)#, targetName='testApp', icon='favicon.ico')
]

setup(
         name = "websooocket",
         version = "1.0",
         description = "",
      options = dict(build_exe = buildOptions),
      executables = executables
         )
##
##ss = [[s[len('tkintttttttttttttter'):-3], s, s.replace('.py', '.7z')] for s in os.listdir() if s.startswith('tkintttttttttttttter') and s.endswith('.py')]
##print(len(ss))
##for s in ss:
##    print(s[1])
##    os.mkdir(s[0])
##    os.mkdir(os.path.join(s[0], 'code'))
##    os.mkdir(os.path.join(s[0], 'exe'))
##    try:
##        os.rename(os.path.join(os.getcwd(), s[1]), os.path.join(os.getcwd(), s[0], 'code', s[1]))
##    except Exception as e:
##        print('-------------------', s)
##        print(str(e));pass
##    try:
##        os.rename(os.path.join(os.getcwd(), s[2]), os.path.join(os.getcwd(), s[0], 'exe', s[2]))
##    except Exception as e:
##        print('-------------------', s)
##        print(str(e));pass
