# cd Documents/projects/cisco site/front-end/front end/

# a = "Chemistry HL, Physics HL, Mathematics AA HL, Spanish Ab HL, Language and Literature SL, Economics SL"
# a = a.split(', ')
# for x in a:
#     print(f'<a href="/class/"><li class="truncate">{x}</li></a>')
#
# n = 1
# for i in a:
#     print(f'<option value="{n}">{i}</option>')
#     n += 1

#
a = "Open class, Leave class, Rename, Delete class"
a = a.split(', ')
for x in a:
    print(f'<li><a href="#!" class="class_options">{x}</a></li>')



# a = "nord-lightblue, nord-darkblue, nord-darkgrey, nord-red, nord-orange, nord-purple, nord-yellow"
# a = a.split(', ')
# for x in a:
#     print(f'<li><div class="color {x}"></div></li>')
