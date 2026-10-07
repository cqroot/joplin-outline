# tilde fence

~~~bash
# not a header
~~~

# after tilde block

~~~

## not a header

~~~

## after plain tilde block

~~~~
# not a header
~~~~

## after longer tilde fence

# tilde inside tick block

```
~~~bash
## not a header
~~~
```

## after tick block containing tilde

~~~bash
```
## not a header
```
~~~

## after tilde block containing ticks

`````
# not a header (five backticks, closed by five)
`````

## after five-backtick fence

``````
# not a header
```
## still inside (three backticks cannot close six)
````
## still inside (four backticks cannot close six)
``````

## after six-backtick fence

~~~~~
# longer tilde fence closed by five
~~~~~

## after five-tilde fence
