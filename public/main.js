//basic_url = 'https://khoefli.pythonanywhere.com/skyobjects/'
let basic_url = 'http://localhost:4998/skyobjects/'
/*----------------------------------------------------------------------------*/
/* hideDataTables()                                                           */
/*----------------------------------------------------------------------------*/
function hideDataTables()
{
  document.getElementById('data-model').style.display = 'none'
  document.getElementById('documentation').style.display = 'none'

 // Hide all elements with class="table-content" by default
  var i,tbcontents
  tbcontents = document.getElementsByClassName("table-content");
  for(i=0;i<tbcontents.length;i++)
    tbcontents[i].style.display = 'none';

  var j,boxes;
  boxes = document.getElementsByClassName("popup-box");
  for(j=0;j<boxes.length;j++)
    boxes[j].style.display = 'none';
}

/*----------------------------------------------------------------------------*/
/* open additional pages                                                      */
/*----------------------------------------------------------------------------*/
function openDataModel()
{
  hideDataTables();
  document.getElementById('data-model').style.display = 'block';
}

/*----------------------------------------------------------------------------*/
/* changePage()                                                               */
/*----------------------------------------------------------------------------*/
function changePage(pageName)
{
  hideDataTables();

  // remove the background color of all table elements
  let tables = document.getElementsByClassName("table-content");
  for (i = 0; i < tables.length; i++)
    tables[i].style.backgroundColor = "";

  // show the specific table content
  let id = document.getElementById(pageName);
  if(id != null)
    id.style.display = 'block';
}

/*----------------------------------------------------------------------------*/
/* message(), getHome(), getAbout()                                           */
/*----------------------------------------------------------------------------*/
function message(msg)
{
  let ele = document.querySelector('#messages');
  let div = document.createElement('div');
 
  ele.textContent = msg;
  ele.prepend(div);
}

function getHome()
{
  $('#main-content').text("");
  $('#main-content').append("This is <i>Sky Objects Database</i>, ");
  $('#main-content').append("an application presenting celestrical items.");
}

function getAbout()
{
  $('#main-content').text("");
  $('#main-content').append("Author: Klaus H&ouml;flinger, ");
  $('#main-content').append("Email: <i>khoeflinger@t-online.de</i>");
}

/*----------------------------------------------------------------------------*/
/* createTable(), getData(), fillTable()                                      */
/*----------------------------------------------------------------------------*/
function createTable(title,classname)
{
  table = new $('#'+classname+'-table').DataTable({pageLength:12});
  table.caption('--- ' + title + ' ---','top');
  table.select.style('single');

  table.on('click', 'tbody tr', function (e)
  {
    let classList = e.currentTarget.classList;
 
    if (classList.contains('selected'))
      classList.remove('selected');
    else
    {
      table.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
      classList.add('selected');
    }
  });
  if(classname == 'Constellation')
    fillConstellationTable(table)
  if(classname == 'Category')
    fillCategoryTable(table)
  if(classname == 'Catalog')
    fillCatalogTable(table)
  if(classname == 'MessierObject')
    fillMessierTable(table)
  if(classname == 'NgcicObject')
    fillNgcicObjectTable(table)
  if(classname == 'Keyword')
    fillKeywordTable(table)
  if(classname == 'SkyObject')
    fillSkyObjectTable(table)
}

function fillConstellationTable(table)
{
  $.each(Constellation_Data, function(i, data)
  {
    table.row.add([data.id,
                   data.code,
                   data.name_de,
                   data.name_lt,
                   data.name_en,
                   data.hemisphere,
                   data.detector,
                   data.year,
                   data.vis1,
                   data.vis2]);
  }
  );
  table.draw();
}

function fillCategoryTable(table)
{
  $.each(Category_Data, function(i, data)
  {
    table.row.add([data.id,
                   data.code,
                   data.name_de,
                   data.name_en]);
  }
  );
  table.draw();
}

function fillCatalogTable(table)
{
  $.each(Catalog_Data, function(i, data)
  {
    table.row.add([data.id,
                   data.name,
                   data.prefix,
                   data.description]);
  }
  );
  table.draw();
}

function fillMessierTable(table)
{
  $.each(MessierObject_Data, function(i, data)
  {
    table.row.add([data.id,
                   data.label,
                   data.constellation,
                   data.category,
                   data.subtype,
                   data.distance,
                   data.unit,
                   data.magnitude,
                   data.ngcic,
                   data.remark]);
  }
  );
  table.draw();
}

function fillNgcicObjectTable(table)
{
  $.each(NgcicObject_Data, function(i, data)
  {
      table.row.add([data.id,
                     data.label,
                     data.constellation,
                     data.category,
                     data.subtype,
                     data.ra,
                     data.de,
                     data.b_mag,
                     data.v_mag,
                     data.brightness,
                     data.position_angle,
                     data.z,
                     data.distance_z,
                     data.distance_ned,
                     data.keywords,
                     data.comment
                    ]);
  }
  );
  table.draw();
}

function fillKeywordTable(table)
{
  $.each(Keyword_Data, function(i, data)
  {
    table.row.add([data.id,
                   data.key,
                   data.references]);
  }
  );
  table.draw();
}

function fillSkyObjectTable(table)
{
  $.each(SkyObject_Data, function(i, data)
  {
    table.row.add([data.id,
                   data.keywords,
                   data.comment,
                   data.references
                  ]);
  }
  );
  table.draw();
}

/*----------------------------------------------------------------------------*/
/* openDeleteDialog(), removeItemFromTable()                                  */
/*----------------------------------------------------------------------------*/
function openDeleteDialog(classname,index)
{
  let table = $('#' + classname + '-table').DataTable();
  let count = table.rows('.selected').count();
  if(count > 0)
  {
    let title = table.row('.selected').data()[index];
    if(confirm('do you really want to delete ' + title))
    {
      let ID  = table.rows('.selected').data()[0];
      let URL = basicUrl + classname + '/deleteById/' + ID;

      $.ajax(
      {
        type:        'DELETE',
        url:          URL,
        contentType: 'application/json; charset=utf-8'
      })
      .done(function(data) { removeItemFromTable(tablename); })
      .fail(function()     { message(URL + ' failed.'); });
    }
  }
  else
    message("no entry selected.");
}

function removeItemFromTable(classname)
{
  let table = $('#' + classename).DataTable();
  table.row('.selected').remove();
  table.draw();
  message('selected entry deleted.');
}

/*----------------------------------------------------------------------------*/
/* info function                                                              */
/*----------------------------------------------------------------------------*/
function openInfoDialog(classname)
{
  message("");
  let items = $('#' + classname + '-table').DataTable().row('.selected').data();
  if(items == null)
  {
    message("no entry selected.");
    return
  }

  let id = items[0];

  if(classname == 'Constellation')
  {
    for(i=0;i<Constellation_Data.length;i++)
    {
      if(Constellation_Data[i].id == id)
      {
        showInfoDialog(classname,Constellation_Data[i]);
        return;
      }
    }
    message('constellation not found.');
  }

  if(classname == 'Catalog')
  {
    for(i=0;i<Catalog_Data.length;i++)
    {
      if(Catalog_Data[i].id == id)
      {
        showInfoDialog(classname,Catalog_Data[i]);
        return;
      }
    }
    message('catalog not found.');
  }

  if(classname == 'Category')
  {
    for(i=0;i<Category_Data.length;i++)
    {
      if(Category_Data[i].id == id)
      {
        showInfoDialog(classname,Category_Data[i]);
        return;
      }
    }
    message('category not found.');
  }

  if(classname == 'MessierObject')
  {
    for(i=0;i<MessierObject_Data.length;i++)
    {
      if(MessierObject_Data[i].id == id)
      {
        showInfoDialog(classname,MessierObject_Data[i]);
        return;
      }
    }
    message('Messier object not found.');
  }

  if(classname == 'NgcicObject')
  {
    for(i=0;i<NgcicObject_Data.length;i++)
    {
      if(NgcicObject_Data[i].id == id)
      {
        showInfoDialog(classname,NgcicObject_Data[i]);
        return;
      }
    }
    message('NGC/IC object not found.');
  }

  if(classname == 'Keyword')
  {
    for(i=0;i<Keyword_Data.length;i++)
    {
      if(Keyword_Data[i].id == id)
      {
        showInfoDialog(classname,Keyword_Data[i]);
        return;
      }
    }
    message('keyword not found.');
  }

  if(classname == 'SkyObject')
  {
    for(i=0;i<SkyObject_Data.length;i++)
    {
      if(SkyObject_Data[i].id == id)
      {
        showInfoDialog(classname,SkyObject_Data[i]);
        return;
      }
    }
    message('sky object not found.');
  }
}

function showInfoDialog(classname,data)
{
  if(classname == 'Constellation')
  {
    putValue('info-constellation-code',       data.code);
    putValue('info-constellation-name_lt',    data.name_lt);
    putValue('info-constellation-name_de',    data.name_de);
    putValue('info-constellation-name_en',    data.name_en);
    putValue('info-constellation-hemisphere', data.hemisphere);
    putValue('info-constellation-detector',   data.detector);
    putValue('info-constellation-year',       data.year);
    putValue('info-constellation-vis1',       data.vis1);
    putValue('info-constellation-vis2',       data.vis2);
  }

  if(classname == 'Category')
  {
    putValue('info-category-code',    data.code);
    putValue('info-category-name_de', data.name_de);
    putValue('info-category-name_en', data.name_en);
  }

  if(classname == 'Catalog')
  {
    putValue('info-catalog-name',        data.name);
    putValue('info-catalog-prefix',      data.prefix);
    putValue('info-catalog-description', data.description);
  }

  if(classname == 'MessierObject')
  {
    putValue('info-messier-object-label',         data.label);
    putValue('info-messier-object-constellation', data.constellation);
    putValue('info-messier-object-category',      data.category);
    putValue('info-messier-object-subtype',       data.subtype);
    putValue('info-messier-object-distance',      data.distance);
    putValue('info-messier-object-unit',          data.unit);
    putValue('info-messier-object-v_mag',         data.magnitude);
    putValue('info-messier-object-ngcic',         data.ngcic);
    putValue('info-messier-object-remark',        data.remark);
  }

  if(classname == 'NgcicObject')
  {
    putValue('info-ngcic-object-label',           data.label);
    putValue('info-ngcic-object-constellation',   data.constellation);
    putValue('info-ngcic-object-category',        data.category);
    putValue('info-ngcic-object-subtype',         data.subtype);
    putValue('info-ngcic-object-right-ascension', data.ra);
    putValue('info-ngcic-object-declination',     data.de);
    putValue('info-ngcic-object-b_mag',           data.b_mag);
    putValue('info-ngcic-object-v_mag',           data.v_mag);
    putValue('info-ngcic-object-brightness',      data.brightness);
    putValue('info-ngcic-object-position-angle',  data.position_angle);
    putValue('info-ngcic-object-z',               data.z);
    putValue('info-ngcic-object-distance-z',      data.distance_z);
    putValue('info-ngcic-object-distance-ned',    data.distance_ned);
    putValue('info-ngcic-object-keywords',        data.keywords);
    putValue('info-ngcic-object-comment',         data.comment);
  }

  if(classname == 'Keyword')
  {
    putValue('info-keyword-key',        data.key);
    putValue('info-keyword-references', data.references);
  }

  if(classname == 'SkyObject')
  {
    putValue('info-skyobject-keywords',   data.keywords);
    putValue('info-skyobject-comment',    data.comment);
    putValue('info-skyobject-references', data.references);
  }

  document.getElementById(classname + '-info').style.display = 'block';
}

function closePopupBox(id)
{
  document.getElementById(id).style.display = 'none';
}

function putValue(id,value)
{
  let val = (value == 'null') ? '' : value;
  document.getElementById(id).innerHTML = val;
}

function welcome()
{
  message('welcome to SkyObjects.');
}

/*----------------------------------------------------------------------------*/
/* call main functions                                                        */
/*----------------------------------------------------------------------------*/
getHome();
hideDataTables();
createTable('Constellations',         'Constellation');
createTable('Catalogs',               'Catalog');
createTable('Categories',             'Category');
createTable('Messier Objects',        'MessierObject');
createTable('NGC/IC Objects',         'NgcicObject');
createTable('Keywords',               'Keyword');
createTable('Sky Objects',            'SkyObject');
changePage('Constellations');

welcome();
