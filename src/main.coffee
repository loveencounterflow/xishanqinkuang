

'use strict'


'use strict'

GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'xsqk'
{ rpr
  inspect
  echo
  reverse
  log     }               = GUY.trm
# WGUY                      = require '../../../apps/webguy'
# { f }                     = require '../../../apps/effstring'
#-----------------------------------------------------------------------------------------------------------
{ freeze,
  lets,                 } = require 'letsfreezethat'
#-----------------------------------------------------------------------------------------------------------
SFMODULES                 = require 'bricabrac-sfmodules'
{ type_of,              } = SFMODULES.unstable.require_type_of()
{ Jetstream,
  Async_jetstream,      } = SFMODULES.require_jetstream()
{ walk_lines_with_positions: \
    walk_lines,         } = SFMODULES.unstable.require_fast_linereader()
#-----------------------------------------------------------------------------------------------------------
PATH                      = require 'node:path'
FS                        = require 'node:fs'
#-----------------------------------------------------------------------------------------------------------
sfmodules_path            = PATH.dirname require.resolve 'bricabrac-sfmodules/package.json'
sfmodules_resources_path  = PATH.join sfmodules_path, 'resources'
html_start_tags_path      = PATH.join sfmodules_resources_path, 'dont-forget-these-html-tags.html'
html_start_tags           = FS.readFileSync html_start_tags_path, { encoding: 'utf-8', }
#-----------------------------------------------------------------------------------------------------------
diff_cmd                  = """git diff --no-index --word-diff=plain --word-diff-regex=. filtered.old.md filtered.new.md > diff.txt"""
diff_cwd                  = PATH.resolve __dirname, '../comparison/result'


#===========================================================================================================
class Xsqk_differ

  # #---------------------------------------------------------------------------------------------------------
  # constructor: ->
  #   ;undefined

  #---------------------------------------------------------------------------------------------------------
  write_report: ->
    #.........................................................................................................
    # old_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.old.md'
    # new_path = PATH.resolve __dirname, '..', 'comparison/result/filtered.new.md'
    diff_path   = PATH.resolve __dirname, '../comparison/result/diff.txt'
    report_path = PATH.resolve __dirname, '../comparison/result/report.html'
    #.........................................................................................................
    stream = new Async_jetstream()
    # stream.push ( d ) -> debug 'Ωxsqk___4', d
    #.........................................................................................................
    stream.push erase_blocks = ( d ) ->
      return yield d unless d.type is 'raw'
      yield lets d, ( d ) -> d.line = d.line.replace /█/g, ''
      ;null
    #.........................................................................................................
    stream.push filter_diff_start = ( d ) ->
      # debug 'Ωxsqk___1', ( rpr d )[ .. 100 ]
      return null if d.line is ''
      return null if d.line.startsWith 'diff --git'
      return null if d.line.startsWith 'index '
      return null if d.line.startsWith '--- '
      return null if d.line.startsWith '+++ '
      return null if d.line.startsWith '@@ '
      d = lets d, ( d ) -> d.type = 'markdown'
      yield d
      ;null
    #.........................................................................................................
    stream.push translate_changes = ( d ) ->
      yield lets d, ( d ) ->
        # d.type = 'html'
        d.line = d.line.replace /\[-/g,   '<del>'
        d.line = d.line.replace /-\]/g,   '</del>'
        d.line = d.line.replace /\{\+/g,  '<ins>'
        d.line = d.line.replace /\+\}/g,  '</ins>'
        # d.line = "\n<div>#{d.line}</div>\n\n"
      ;null
    #.........................................................................................................
    stream.push translate_headings = ( d ) ->
      return yield d unless d.type is 'markdown'
      return yield d unless ( match = d.line.match /^(?<hashes>#{1,6})\s(?<heading>.*)$/ )?
      { hashes,
        heading,  } = match.groups
      tag_name      = "h#{hashes.length}"
      # heading       = heading.replace /№\s*/g, ''
      yield lets d, ( d ) ->
        d.type = 'html'
        d.line = "\n\n<#{tag_name}>#{heading}</#{tag_name}>\n"
      ;null
    #.........................................................................................................
    stream.push add_divs = ( d ) ->
      return yield d unless d.type is 'markdown'
      yield lets d, ( d ) ->
        d.type = 'html'
        d.line = "\n<div>#{d.line}</div>\n"
      ;null
    #.........................................................................................................
    stream.push '#first', clear_file   = ( d ) -> FS.writeFileSync report_path, ''
    stream.push '#first', prepend_css  = ( d ) -> yield d; yield freeze { type: 'html', line: "<link rel=stylesheet href='./diff.css'>", } ;null
    stream.push '#first', prepend_html = ( d ) -> yield d; yield freeze { type: 'html', line: html_start_tags, } ;null
    stream.push '#last',  append_eof   = ( d ) -> yield { line: '<!-- eof -->', }; yield d ;null
    stream.push '*', ( d ) -> whisper 'Ωxsqk___1', ( rpr d )[ .. 100 ]
    #.........................................................................................................
    stream.push write_output = ( d ) ->
      return yield d unless d.type is 'html'
      FS.appendFileSync report_path, d.line
      yield d
      ;null
    #.........................................................................................................
    # for { line, } from walk_lines_with_positions old_path
    #   stream.send { version: 'old', line, }
    stream.cue 'first'
    for { lnr, line, eof, } from walk_lines diff_path
      stream.send freeze { type: 'raw', lnr, line, }
    stream.cue 'last'
    await stream.run()
    #.........................................................................................................
    ;null

#===========================================================================================================
demo = ->
  ( new Xsqk_differ().write_report() )
  ;null

#===========================================================================================================
if module is require.main then await do =>
  await demo()

