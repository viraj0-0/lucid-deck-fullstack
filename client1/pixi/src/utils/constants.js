export const EXAMPLE_PROGRAMS = {
  python_hello: {
    label: "Python: Hello World",
    lang: "python",
    code: `print("Hello World")\nname = input("What is your name? ")\nprint(f"Nice to meet you, {name}!")`,
  },
  c_hello: {
    label: "C: Hello World",
    lang: "c",
    code: `#include <stdio.h>\n\nint main() {\n char name[50];\n printf("Hello World\\n");\n printf("Enter your name: ");\n scanf("%s", name);\n printf("Nice to meet you, %s!\\n", name);\n return 0;\n}`,
  },
  // keep the rest as needed (truncated for brevity)
};
